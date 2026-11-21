
export type CbtBlock = {
  id: string
  type: "heading" | "paragraph" | "instruction" | "image" | "question" | "answer" | "table"
  text?: string
  title?: string
  accesscode?: string
  src?: string
  alt?: string
  caption?: string
  headers?: string[]
  rows?: (string | number)[][]
  options?: string[]
  answer?: string | number | string[]
  explanation?: string
  marks?: number
  questionType?: "objective" | "theory"
}

export type CbtSection = {
  id: string
  name: string
  blocks: CbtBlock[]
}

export type CbtSubject = {
  id: string
  name: string
  code: string
  accesscode: string
  board?: "WAEC" | "NECO" | "NABTEB" | "JAMB" | "Custom"
  year: string
  paper?: string
  durationMinutes?: number
  instructions?: string
  examType: "objective" | "practical" | "mixed"
  sections: CbtSection[]
}

export type CbtCurriculum = {
  version: number
  subjects: CbtSubject[]
}

export type CbtPaperSummary = Pick<
  CbtSubject,
  | "id"
  | "name"
  | "code"
  | "board"
  | "year"
  | "paper"
  | "durationMinutes"
  | "examType"
  | "accesscode"
> & {
  paperId: string
  questionCount: number
  updatedAt?: string
}



async function cbtApiFetch<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  const config = useRuntimeConfig()
  return await $fetch<T>(path, {
    ...options,
    baseURL: config.public.apiUrl,
    credentials: "include",
  })
}

export async function getCbtCurriculum() {
  const response = await cbtApiFetch<{ success: boolean; data: CbtCurriculum }>("/api/cbt/admin/subjects")
  console.log(response.data);
  return response.data
}

export async function getCbtSubjects() {
  const response = await cbtApiFetch<{ success: boolean; data: CbtPaperSummary[] }>("/api/cbt/subjects")
  console.log(response.data);
  return response.data
}

export async function getCbtSubject(id: string) {
  if (!id.trim()) throw new Error("Exam paper id is required.")
  const response = await cbtApiFetch<{ success: boolean; data: CbtSubject }>(
    `/api/cbt/subjects/${encodeURIComponent(id)}`
  )
  return response.data
}

export async function getCbtSubjectByAccessCode(id: string) {
  if (!id.trim()) throw new Error("Exam paper id is required.")
  const response = await cbtApiFetch<{ success: boolean; data: CbtSubject }>(
    `/api/cbt/subjects/access/${encodeURIComponent(id)}`
  )
  return response.data
}

export async function updateCbtSubject(id: string, subject: CbtSubject) {
  if (!id.trim()) throw new Error("Exam paper id is required.")
  return await cbtApiFetch<{ success: boolean; message: string; data: CbtSubject }>(
    `/api/cbt/subjects/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: { subject },
    }
  )
}

export async function uploadCbtImage(file: File) {
  const form = new FormData()
  form.append("image", file)
  return await cbtApiFetch<{ success: boolean; data: { src: string; publicId: string } }>(
    "/api/cbt/images",
    { method: "POST", body: form }
  )
}

export async function submitCbtAttempt(paperId: string, answers: Record<string, string | string[]>) {
  return await cbtApiFetch<{
    success: boolean
    data: {
      id: string
      paperId: string
      score: number
      possible: number
      percentage: number
      submittedAt: string
    }
  }>("/api/cbt/attempt", {
    method: "POST",
    body: { paperId, answers },
  })
}
