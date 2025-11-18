import { create } from 'zustand'
import type { Question } from '@/types'
import { questionApi } from '@/services/api'
import { submitQuestion, voteQuestion, unvoteQuestion, setSocketCallbacks } from '@/services/socket'

interface QuestionState {
  questions: Question[]
  isLoading: boolean
  error: string | null
  votedQuestionIds: Set<string>

  // Actions
  fetchQuestions: (sessionId: string, userId?: string) => Promise<void>
  addQuestion: (question: Question) => void
  updateQuestion: (question: Question) => void
  removeQuestion: (questionId: string) => void
  submit: (sessionId: string, text: string, isAnonymous: boolean) => void
  vote: (questionId: string) => void
  unvote: (questionId: string) => void
  moderate: (questionId: string, status: 'approved' | 'rejected' | 'answered', answer?: string) => Promise<void>
  setupSocketListeners: () => void
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  isLoading: false,
  error: null,
  votedQuestionIds: new Set(),

  fetchQuestions: async (sessionId: string, userId?: string) => {
    set({ isLoading: true, error: null })

    try {
      const questions = await questionApi.getBySession(sessionId, userId)

      // Track voted questions
      const votedIds = new Set<string>()
      questions.forEach(q => {
        if ((q as any).has_user_voted) {
          votedIds.add(q.id)
        }
      })

      set({
        questions: questions.sort((a, b) => b.votes - a.votes),
        votedQuestionIds: votedIds,
        isLoading: false
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch questions'
      set({ isLoading: false, error: message })
    }
  },

  addQuestion: (question: Question) => {
    set(state => ({
      questions: [question, ...state.questions].sort((a, b) => b.votes - a.votes)
    }))
  },

  updateQuestion: (question: Question) => {
    set(state => ({
      questions: state.questions
        .map(q => q.id === question.id ? question : q)
        .sort((a, b) => b.votes - a.votes)
    }))
  },

  removeQuestion: (questionId: string) => {
    set(state => ({
      questions: state.questions.filter(q => q.id !== questionId)
    }))
  },

  submit: (sessionId: string, text: string, isAnonymous: boolean) => {
    submitQuestion(sessionId, text, isAnonymous)
  },

  vote: (questionId: string) => {
    voteQuestion(questionId)
    set(state => {
      const newVotedIds = new Set(state.votedQuestionIds)
      newVotedIds.add(questionId)
      return {
        votedQuestionIds: newVotedIds,
        questions: state.questions.map(q =>
          q.id === questionId ? { ...q, votes: q.votes + 1 } : q
        ).sort((a, b) => b.votes - a.votes)
      }
    })
  },

  unvote: (questionId: string) => {
    unvoteQuestion(questionId)
    set(state => {
      const newVotedIds = new Set(state.votedQuestionIds)
      newVotedIds.delete(questionId)
      return {
        votedQuestionIds: newVotedIds,
        questions: state.questions.map(q =>
          q.id === questionId ? { ...q, votes: Math.max(0, q.votes - 1) } : q
        ).sort((a, b) => b.votes - a.votes)
      }
    })
  },

  moderate: async (questionId: string, status: string, answer?: string) => {
    try {
      const updated = await questionApi.update(questionId, { status, answer })
      get().updateQuestion(updated)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to moderate question'
      set({ error: message })
    }
  },

  setupSocketListeners: () => {
    setSocketCallbacks({
      onQuestionNew: (question) => {
        get().addQuestion(question)
      },
      onQuestionUpdate: (question) => {
        get().updateQuestion(question)
      },
      onQuestionDelete: ({ questionId }) => {
        get().removeQuestion(questionId)
      },
    })
  },
}))
