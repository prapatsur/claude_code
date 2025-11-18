import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useQuestionStore } from './questionStore'
import { act } from '@testing-library/react'

// Mock the API and socket services
vi.mock('@/services/api', () => ({
  questionApi: {
    getBySession: vi.fn(),
    submit: vi.fn(),
    vote: vi.fn(),
    unvote: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/services/socket', () => ({
  submitQuestion: vi.fn(),
  voteQuestion: vi.fn(),
  unvoteQuestion: vi.fn(),
  setSocketCallbacks: vi.fn(),
}))

describe('questionStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useQuestionStore.getState()
    store.questions = []
    store.votedQuestionIds = new Set()
    store.isLoading = false
    store.error = null
  })

  it('should initialize with empty state', () => {
    const store = useQuestionStore.getState()

    expect(store.questions).toEqual([])
    expect(store.votedQuestionIds.size).toBe(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should add a question to the store', () => {
    const store = useQuestionStore.getState()

    const question = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Test question',
      isAnonymous: false,
      votes: 5,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question)
    })

    expect(useQuestionStore.getState().questions).toHaveLength(1)
    expect(useQuestionStore.getState().questions[0]).toEqual(question)
  })

  it('should sort questions by votes (descending)', () => {
    const store = useQuestionStore.getState()

    const question1 = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Question 1',
      isAnonymous: false,
      votes: 10,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    const question2 = {
      id: '2',
      sessionId: 'session-1',
      userId: 'user-2',
      text: 'Question 2',
      isAnonymous: false,
      votes: 20,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question1)
      store.addQuestion(question2)
    })

    const questions = useQuestionStore.getState().questions
    expect(questions[0].votes).toBe(20)
    expect(questions[1].votes).toBe(10)
  })

  it('should update a question', () => {
    const store = useQuestionStore.getState()

    const question = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Original text',
      isAnonymous: false,
      votes: 5,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question)
    })

    const updatedQuestion = { ...question, status: 'approved' as const, votes: 10 }

    act(() => {
      store.updateQuestion(updatedQuestion)
    })

    expect(useQuestionStore.getState().questions[0].status).toBe('approved')
    expect(useQuestionStore.getState().questions[0].votes).toBe(10)
  })

  it('should remove a question', () => {
    const store = useQuestionStore.getState()

    const question = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Test question',
      isAnonymous: false,
      votes: 5,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question)
    })

    expect(useQuestionStore.getState().questions).toHaveLength(1)

    act(() => {
      store.removeQuestion('1')
    })

    expect(useQuestionStore.getState().questions).toHaveLength(0)
  })

  it('should track voted question IDs when voting', () => {
    const store = useQuestionStore.getState()

    const question = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Test question',
      isAnonymous: false,
      votes: 5,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question)
      store.vote('1')
    })

    expect(useQuestionStore.getState().votedQuestionIds.has('1')).toBe(true)
    expect(useQuestionStore.getState().questions[0].votes).toBe(6)
  })

  it('should remove vote tracking when unvoting', () => {
    const store = useQuestionStore.getState()

    const question = {
      id: '1',
      sessionId: 'session-1',
      userId: 'user-1',
      text: 'Test question',
      isAnonymous: false,
      votes: 5,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }

    act(() => {
      store.addQuestion(question)
      store.vote('1')
    })

    expect(useQuestionStore.getState().votedQuestionIds.has('1')).toBe(true)

    act(() => {
      store.unvote('1')
    })

    expect(useQuestionStore.getState().votedQuestionIds.has('1')).toBe(false)
    expect(useQuestionStore.getState().questions[0].votes).toBe(5)
  })
})
