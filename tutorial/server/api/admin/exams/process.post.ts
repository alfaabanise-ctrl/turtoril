
import { GoogleGenAI } from '@google/genai'
import { createError, defineEventHandler, readBody } from 'h3'

interface ExamBlock {
  type: string
  [key: string]: unknown
}

interface ExamMetadata {
  examBody: string
  subject: string
  subjectId?: string
  year: number
  paperType: string
  durationMinutes: number
  status: string
}

interface ProcessBody {
  mode: 'text' | 'json'
  text?: string
  json?: string
  metadata: ExamMetadata
}

interface ProcessResult {
  blocks?: unknown
  correctedCount?: number
}

const BLOCK_TYPES = [
  'instructions',
  'section',
  'passage',
  'question',
  'answer',
  'table',
  'image',
]

function extractJson(value: string): unknown {
  const cleaned = value
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Gemini returned invalid JSON.',
    })
  }
}

function validateBlocks(value: unknown): ExamBlock[] {
  if (!value || typeof value !== 'object') {
    throw createError({
      statusCode: 422,
      statusMessage: 'Gemini returned an invalid examination structure.',
    })
  }

  const rawBlocks = (value as { blocks?: unknown }).blocks

  if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'No examination blocks were generated.',
    })
  }

  for (const [index, block] of rawBlocks.entries()) {
    if (
      !block ||
      typeof block !== 'object' ||
      !BLOCK_TYPES.includes((block as ExamBlock).type)
    ) {
      throw createError({
        statusCode: 422,
        statusMessage: `Invalid block at position ${index + 1}.`,
      })
    }
  }

  return rawBlocks as ExamBlock[]
}

function createPrompt(
  metadata: ExamMetadata,
  source: string,
  mode: 'text' | 'json',
): string {
  const task = mode === 'text'
    ? `
Convert the supplied examination text into structured examination blocks.
Preserve the original question order and examination content.
`
    : `
Correct and improve the supplied examination JSON.
Preserve its existing structure, block types, image references and data.
Do not convert it into a different data structure.
`

  return `
You are an expert examination-paper editor and educational content formatter.

EXAMINATION INFORMATION:
${JSON.stringify(metadata, null, 2)}

YOUR TASK:
${task}

IMPORTANT RULES:

1. Use only the supplied examination content.
2. Correct spelling, grammar, punctuation and obvious typographical errors.
3. Preserve the original meaning and academic intent of every question.
4. Do not invent questions, options, answers, explanations or marks.
5. Never guess missing answers.
6. Preserve question numbers and their original order.
7. Preserve option labels such as A, B, C and D.
8. Preserve all existing marks.
9. Preserve passages, instructions, sections and tables.
10. Preserve mathematical expressions, chemical formulae and scientific symbols.
11. For theory papers, preserve essay questions and sub-question numbering.
12. Do not create objective options for theory questions.
13. Do not merge separate questions or sub-questions.
14. Keep answers separate from question blocks.
15. Only include answers explicitly supplied in the source.
16. Do not remove important examination information.
17. Do not add explanations unless they already exist in the source.
18. Return one flat, ordered blocks array.
19. Do not create nested sections.
20. Return valid JSON only, without Markdown fences or commentary.

SUPPORTED BLOCK TYPES:

1. instructions
{
  "type": "instructions",
  "text": "Answer all questions."
}

2. section
{
  "type": "section",
  "title": "SECTION A"
}

3. passage
{
  "type": "passage",
  "title": "Read the passage carefully",
  "text": "Passage content..."
}

4. question
{
  "type": "question",
  "number": 1,
  "text": "What is the capital of Nigeria?",
  "marks": 1,
  "options": [
    {
      "label": "A",
      "text": "Lagos"
    },
    {
      "label": "B",
      "text": "Abuja"
    }
  ]
}

5. answer
{
  "type": "answer",
  "number": 1,
  "text": "Abuja",
  "explanation": "Explanation if supplied in the source."
}

6. table
{
  "type": "table",
  "headers": ["Name", "Value"],
  "rows": [
    ["Example", "Value"]
  ]
}

7. image
{
  "type": "image",
  "imageIndex": 0,
  "caption": "Image caption if supplied."
}

IMAGE RULES:

- Images are uploaded and managed separately by the application.
- You cannot access, read, interpret, transcribe or analyze uploaded images.
- Never generate image URLs, file paths, image IDs or image contents.
- In text mode, do not create image blocks based on assumptions.
- In JSON mode, preserve existing image blocks and their references exactly.
- Never replace an existing image reference with a guessed reference.
- If the text contains an image placeholder, preserve it as text unless an existing image reference is supplied.

QUESTION RULES:

- Preserve every original question number.
- Preserve labels such as (1a), (2bi), (5aii) and (3c).
- Keep each sub-question separate.
- Preserve every multiple-choice option and its original label.
- Do not guess the correct option.
- Do not put answers inside question blocks.
- For theory questions, do not generate options.
- Keep answers immediately after their corresponding questions when both exist in the source.

OUTPUT FORMAT:

Return exactly this structure:

{
  "blocks": [
    {
      "type": "instructions",
      "text": "Answer all questions."
    },
    {
      "type": "section",
      "title": "SECTION A"
    },
    {
      "type": "question",
      "number": 1,
      "text": "Example question",
      "marks": 1,
      "options": [
        {
          "label": "A",
          "text": "Option one"
        },
        {
          "label": "B",
          "text": "Option two"
        }
      ]
    }
  ],
  "correctedCount": 0
}

The correctedCount should be the number of corrections made to the supplied content. Do not count unchanged blocks.

EXAMINATION SOURCE:
${source}

Return one complete, valid JSON object.
Do not include Markdown fences.
Do not include any additional commentary.
`
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ProcessBody>(event)

  // Validate input mode.
  if (!body || !['text', 'json'].includes(body.mode)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Choose text or JSON input mode.',
    })
  }

  // Validate examination metadata.
  if (
    !body.metadata?.examBody ||
    !body.metadata?.subject ||
    !body.metadata?.subjectId
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        'Exam body, subject and curriculum subject ID are required.',
    })
  }

  // Get the supplied text or JSON.
  const source = body.mode === 'text'
    ? body.text?.trim()
    : body.json?.trim()

  if (!source) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Examination text or JSON is required.',
    })
  }

  // Limit input size.
  if (source.length > 200_000) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Examination content is too large.',
    })
  }

  // Validate Gemini configuration.
  const config = useRuntimeConfig()

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured.',
    })
  }

  const ai = new GoogleGenAI({
    apiKey: config.geminiApiKey,
  })

  const model = 'gemini-3.8-flash'

  const prompt = createPrompt(
    body.metadata,
    source,
    body.mode,
  )

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    })

    const responseText = response.text

    if (!responseText) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Gemini returned an empty response.',
      })
    }

    const parsed = extractJson(responseText) as ProcessResult

    const blocks = validateBlocks(parsed)

    return {
      success: true,
      message: 'Examination blocks processed successfully.',
      blocks,
      correctedCount: Number(parsed.correctedCount) || 0,
    }
  } catch (error) {
    console.error('[EXAM AI PROCESS ERROR]', error)

    if (
      error &&
      typeof error === 'object' &&
      'statusCode' in error
    ) {
      throw error
    }

    throw createError({
      statusCode: 502,
      statusMessage:
        'AI examination processing failed. Please try again.',
    })
  }
})
