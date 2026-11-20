// Shared helpers for CBT admin pages (auto-imported by Nuxt)

type ApiOptions = {
  baseURL: string
  credentials: "include"
}

function apiOptions(): ApiOptions {
  const config = useRuntimeConfig()
  return { baseURL: config.public.apiUrl, credentials: "include" }
}

/**
 * Create/import (no id) or update (id given).
 * Both hit the same backend handler, savePapers.
 */
export async function publishSubjects(incoming: CbtCurriculum, id?: string) {
  if (id) {
    // UPDATE: backend reads req.body.subject
    const subject = (incoming as any)?.subjects?.[0] ?? incoming
    return await $fetch<{ success: boolean; message: string; data: any }>(
      `/api/cbt/subjects/${encodeURIComponent(id)}`,
      { ...apiOptions(), method: "PUT", body: { subject } }
    )
  }

  // CREATE / IMPORT: backend reads req.body.curriculum
  return await $fetch<{ success: boolean; message: string; data: CbtCurriculum }>(
    "/api/cbt/import",
    { ...apiOptions(), method: "POST", body: { curriculum: incoming } }
  )
}

export async function getCbtSubject(id: string) {
  const response = await $fetch<{ success: boolean; data: any }>(
    `/api/cbt/subjects/${encodeURIComponent(id)}`,
    { ...apiOptions(), method: "GET" }
  )
  return response.data
}

export async function deleteCbtSubject(id: string) {
  return await $fetch(`/api/cbt/subjects/${encodeURIComponent(id)}`, {
    ...apiOptions(),
    method: "DELETE",
  })
}

export async function uploadCbtImage(file: File) {
  const form = new FormData()
  form.append("image", file)
  return await $fetch<{ success: boolean; data: { src: string } }>(
    "/api/cbt/images",
    { ...apiOptions(), method: "POST", body: form }
  )
}