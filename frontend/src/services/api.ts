import type { Session, Question, Poll, PollResults } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Helper function for API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Session API
export const sessionApi = {
  create: (data: { name: string; description?: string; settings?: any }) =>
    fetchApi<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByCode: (code: string) =>
    fetchApi<Session>(`/api/sessions/code/${code}`),

  getById: (id: string) =>
    fetchApi<Session>(`/api/sessions/${id}`),

  update: (id: string, data: Partial<Session>) =>
    fetchApi<Session>(`/api/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/api/sessions/${id}`, {
      method: 'DELETE',
    }),
}

// Question API
export const questionApi = {
  getBySession: (sessionId: string, userId?: string, status?: string) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (status) params.append('status', status)
    const query = params.toString() ? `?${params.toString()}` : ''
    return fetchApi<Question[]>(`/api/questions/session/${sessionId}${query}`)
  },

  submit: (data: { sessionId: string; userId: string; text: string; isAnonymous: boolean }) =>
    fetchApi<Question>('/api/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  vote: (questionId: string, userId: string) =>
    fetchApi<{ success: boolean }>(`/api/questions/${questionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  unvote: (questionId: string, userId: string) =>
    fetchApi<{ success: boolean }>(`/api/questions/${questionId}/vote?userId=${userId}`, {
      method: 'DELETE',
    }),

  update: (questionId: string, data: { status?: string; answer?: string }) =>
    fetchApi<Question>(`/api/questions/${questionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (questionId: string) =>
    fetchApi<void>(`/api/questions/${questionId}`, {
      method: 'DELETE',
    }),
}

// Poll API
export const pollApi = {
  getBySession: (sessionId: string, status?: string) => {
    const params = status ? `?status=${status}` : ''
    return fetchApi<Poll[]>(`/api/polls/session/${sessionId}${params}`)
  },

  create: (data: { sessionId: string; question: string; type: string; options?: string[]; settings?: any }) =>
    fetchApi<Poll>('/api/polls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (pollId: string, data: Partial<Poll>) =>
    fetchApi<Poll>(`/api/polls/${pollId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  respond: (pollId: string, userId: string, response: number | number[] | string) =>
    fetchApi<any>(`/api/polls/${pollId}/responses`, {
      method: 'POST',
      body: JSON.stringify({ userId, response }),
    }),

  getResults: (pollId: string) =>
    fetchApi<PollResults>(`/api/polls/${pollId}/results`),

  delete: (pollId: string) =>
    fetchApi<void>(`/api/polls/${pollId}`, {
      method: 'DELETE',
    }),
}
