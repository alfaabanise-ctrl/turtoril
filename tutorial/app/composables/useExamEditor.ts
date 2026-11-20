export interface LessonBlock {
  type: string
  [key: string]: unknown
}

export interface Paper {
  _id?: string
  examBody: string
  subject: string
  subjectId?: string
  year: number
  paperType: 'objective' | 'theory' | 'practical' | 'mixed'
  title: string
  slug: string
  durationMinutes: number
  status: 'draft' | 'published'
  contentHtml?: string
  questionCount?: number
  blocks?: LessonBlock[]
  sections?: unknown[]
  instruction?: LessonBlock[]
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

export const useExamApi = () => {
  const config = useRuntimeConfig()

  async function request<T>(
    path: string,
    options: Parameters<typeof $fetch<T>>[1] = {},
  ): Promise<T> {
    const response = await $fetch<T | ApiEnvelope<T>>(path, {
      ...options,
      baseURL: config.public.apiUrl,
      credentials: 'include',
    })

    if (response && typeof response === 'object' && 'success' in response) {
      const envelope = response as ApiEnvelope<T>
      if (!envelope.success) {
        throw new Error(envelope.message || 'The exam request failed.')
      }
      return envelope.data
    }

    return response as T
  }

  return { request }
}

export const blankPaper = (): Paper => ({
  examBody: 'WAEC',
  subject: '',
  subjectId: '',
  year: new Date().getFullYear(),
  paperType: 'objective',
  title: '',
  slug: '',
  durationMinutes: 0,
  status: 'draft',
  blocks: [],
})
