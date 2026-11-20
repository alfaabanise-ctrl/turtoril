
import { GoogleGenAI } from '@google/genai'

interface ExamBlock {
  type: string
  number?: number
  title?: string
  text?: string
  options?: { label: string; text: string }[]
  answer?: string
  explanation?: string
  marks?: number
  rows?: string[][]
  url?: string
  caption?: string
  [key: string]: any
}

interface TextEntry {
  id: string
  path: (string | number)[]
  value: string
}

interface Correction {
  id: string
  text: string
}

const MAX_CHARS = 18000
const RETRIES_PER_MODEL = 2

function getEditableTexts(blocks: ExamBlock[]): TextEntry[] {
  const entries: TextEntry[] = []

  function add(
    blockIndex: number,
    path: (string | number)[],
    value: unknown,
  ) {
    if (typeof value !== 'string' || !value.trim()) return

    entries.push({
      id: `b${blockIndex}_${entries.length}`,
      path: ['blocks', blockIndex, ...path],
      value,
    })
  }

  blocks.forEach((block, index) => {
    // Correct headings and descriptive text.
    add(index, ['title'], block.title)
    add(index, ['text'], block.text)
    add(index, ['explanation'], block.explanation)
    add(index, ['caption'], block.caption)

    // Correct option text, never option labels.
    block.options?.forEach((option, optionIndex) => {
      add(index, ['options', optionIndex, 'text'], option.text)
    })

    // Correct table cell text.
    block.rows?.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        add(index, ['rows', rowIndex, cellIndex], cell)
      })
    })
  })

  return entries
}

function setPath(
  target: any,
  path: (string | number)[],
  value: string,
) {
  let current = target

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]]
  }

  current[path[path.length - 1]] = value
}

function countLines(value: string) {
  return value.split('\n').length
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function isOverloaded(error: unknown) {
  const message = String(
    (error as Error)?.message || error,
  ).toLowerCase()

  return (
    message.includes('503') ||
    message.includes('429') ||
    message.includes('unavailable') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('high demand')
  )
}

function splitEntries(entries: TextEntry[]) {
  const chunks: TextEntry[][] = []
  let current: TextEntry[] = []
  let size = 0

  for (const entry of entries) {
    const entrySize = entry.value.length

    if (current.length && size + entrySize > MAX_CHARS) {
      chunks.push(current)
      current = []
      size = 0
    }

    current.push(entry)
    size += entrySize
  }

  if (current.length) chunks.push(current)

  return chunks
}

async function correctChunk(
  ai: GoogleGenAI,
  entries: TextEntry[],
  models: string[],
): Promise<Correction[]> {
  const input = entries.map(({ id, value }) => ({
    id,
    text: value,
  }))

  const prompt = `
You are a professional examination-paper proofreader.

Correct spelling, grammar and punctuation ONLY.

The input contains text extracted from existing examination blocks.

STRICT RULES:

1. Do not change the meaning of any text.
2. Do not add new questions or remove existing content.
3. Do not invent answers, explanations or facts.
4. Preserve all question numbers, mathematical expressions,
   scientific symbols, dates, units and numerical values.
5. Preserve option labels and their order.
6. Do not change the correct answer or its meaning.
7. Preserve names, abbreviations and examination terminology.
8. Do not translate the text.
9. Do not add Markdown or HTML.
10. Return exactly one correction for every supplied ID.
11. Keep the IDs unchanged.
12. If a sentence is already correct, return it unchanged.
13. Preserve paragraph and line breaks.

Return ONLY valid JSON in this structure:

{
  "corrections": [
    {
      "id": "b0_0",
      "text": "Corrected text"
    }
  ]
}

TEXT TO CORRECT:

${JSON.stringify(input)}
`

  let lastError: unknown

  for (const model of models) {
    for (let attempt = 1; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                corrections: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      id: { type: 'STRING' },
                      text: { type: 'STRING' },
                    },
                    required: ['id', 'text'],
                  },
                },
              },
              required: ['corrections'],
            },
          },
        })

        const parsed = JSON.parse(response.text || '{}')
        const corrections = parsed.corrections

        if (!Array.isArray(corrections)) {
          throw new Error('Gemini returned an invalid corrections array.')
        }

        const expectedIds = new Set(entries.map(item => item.id))
        const receivedIds = new Set<string>()

        for (const item of corrections) {
          if (
            !item ||
            typeof item.id !== 'string' ||
            typeof item.text !== 'string' ||
            !expectedIds.has(item.id) ||
            receivedIds.has(item.id)
          ) {
            throw new Error('Gemini returned invalid or duplicate block corrections.')
          }

          receivedIds.add(item.id)
        }

        if (receivedIds.size !== expectedIds.size) {
          throw new Error('Gemini did not return every text entry.')
        }

        const originalById = new Map(
          entries.map(entry => [entry.id, entry.value]),
        )

        for (const item of corrections) {
          const original = originalById.get(item.id)!

          if (
            countLines(item.text) !== countLines(original) ||
            (
              countWords(original) > 10 &&
              (
                countWords(item.text) / countWords(original) < 0.85 ||
                countWords(item.text) / countWords(original) > 1.15
              )
            )
          ) {
            throw new Error(
              `Correction validation failed for ${item.id}.`,
            )
          }
        }

        return corrections
      } catch (error) {
        lastError = error

        console.error(
          `Gemini correction failed: ${model}, attempt ${attempt}`,
          error,
        )

        if (!isOverloaded(error)) break

        if (attempt < RETRIES_PER_MODEL) {
          await new Promise(resolve =>
            setTimeout(resolve, 2000 * attempt),
          )
        }
      }
    }
  }

  throw lastError || new Error('All Gemini models failed.')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
 console.log('NUXT SERVER RECEIVED AI CORRECTION REQUEST')
  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured.',
    })
  }

  const body = await readBody(event)

  if (!Array.isArray(body?.blocks) || !body.blocks.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No exam blocks were provided.',
    })
  }

  if (body.blocks.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Too many exam blocks.',
    })
  }

  if (body.blocks.some((block: any) =>
    !block || typeof block !== 'object' ||
    typeof block.type !== 'string'
  )) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid exam block structure.',
    })
  }

  const models = (
    process.env.GEMINI_MODELS ||
    'gemini-2.5-flash,gemini-2.5-flash-lite'
  )
    .split(',')
    .map(model => model.trim())
    .filter(Boolean)

  const ai = new GoogleGenAI({
    apiKey: config.geminiApiKey,
  })

  const originalBlocks: ExamBlock[] = body.blocks
  const correctedBlocks = structuredClone(originalBlocks)

  const entries = getEditableTexts(correctedBlocks)

  if (!entries.length) {
    return {
      success: true,
      message: 'There is no text that needs correction.',
      blocks: correctedBlocks,
      correctedCount: 0,
    }
  }

  const chunks = splitEntries(entries)
  let correctedCount = 0

  try {
    // Process in sequence to avoid overwhelming Gemini.
    for (const chunk of chunks) {
      const corrections = await correctChunk(
        ai,
        chunk,
        models,
      )

      const entryMap = new Map(
        chunk.map(entry => [entry.id, entry]),
      )

      for (const correction of corrections) {
        const entry = entryMap.get(correction.id)!

        setPath(
          correctedBlocks,
          entry.path,
          correction.text,
        )

        correctedCount++
      }
    }

    return {
      success: true,
      message: 'Exam blocks corrected successfully.',
      blocks: correctedBlocks,
      correctedCount,
    }
  } catch (error) {
    console.error('Exam block correction failed:', error)

    throw createError({
      statusCode: 502,
      statusMessage:
        'AI correction failed. Your original exam blocks have not been changed.',
    })
  }
})