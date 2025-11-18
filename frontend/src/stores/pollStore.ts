import { create } from 'zustand'
import type { Poll, PollResults } from '@/types'
import { pollApi } from '@/services/api'
import { respondToPoll, setSocketCallbacks } from '@/services/socket'

interface PollState {
  polls: Poll[]
  activePoll: Poll | null
  results: Record<string, PollResults>
  respondedPollIds: Set<string>
  isLoading: boolean
  error: string | null

  // Actions
  fetchPolls: (sessionId: string) => Promise<void>
  fetchResults: (pollId: string) => Promise<void>
  addPoll: (poll: Poll) => void
  updatePoll: (poll: Poll) => void
  setActivePoll: (poll: Poll | null) => void
  respond: (pollId: string, response: number | number[] | string) => void
  create: (sessionId: string, question: string, type: string, options?: string[]) => Promise<Poll>
  launch: (pollId: string) => Promise<void>
  close: (pollId: string) => Promise<void>
  setupSocketListeners: () => void
}

export const usePollStore = create<PollState>((set, get) => ({
  polls: [],
  activePoll: null,
  results: {},
  respondedPollIds: new Set(),
  isLoading: false,
  error: null,

  fetchPolls: async (sessionId: string) => {
    set({ isLoading: true, error: null })

    try {
      const polls = await pollApi.getBySession(sessionId)
      const activePoll = polls.find(p => p.status === 'active') || null

      set({
        polls,
        activePoll,
        isLoading: false
      })

      // Fetch results for active polls
      for (const poll of polls.filter(p => p.status === 'active' || p.status === 'closed')) {
        get().fetchResults(poll.id)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch polls'
      set({ isLoading: false, error: message })
    }
  },

  fetchResults: async (pollId: string) => {
    try {
      const results = await pollApi.getResults(pollId)
      set(state => ({
        results: { ...state.results, [pollId]: results }
      }))
    } catch (error) {
      console.error('Failed to fetch poll results:', error)
    }
  },

  addPoll: (poll: Poll) => {
    set(state => ({
      polls: [poll, ...state.polls],
      activePoll: poll.status === 'active' ? poll : state.activePoll
    }))
  },

  updatePoll: (poll: Poll) => {
    set(state => ({
      polls: state.polls.map(p => p.id === poll.id ? poll : p),
      activePoll: poll.status === 'active' ? poll :
                  (state.activePoll?.id === poll.id ? null : state.activePoll)
    }))

    // Fetch updated results
    if (poll.status === 'active' || poll.status === 'closed') {
      get().fetchResults(poll.id)
    }
  },

  setActivePoll: (poll) => set({ activePoll: poll }),

  respond: (pollId: string, response: number | number[] | string) => {
    respondToPoll(pollId, response)
    set(state => {
      const newRespondedIds = new Set(state.respondedPollIds)
      newRespondedIds.add(pollId)
      return { respondedPollIds: newRespondedIds }
    })

    // Fetch updated results after a short delay
    setTimeout(() => {
      get().fetchResults(pollId)
    }, 500)
  },

  create: async (sessionId: string, question: string, type: string, options?: string[]) => {
    const poll = await pollApi.create({
      sessionId,
      question,
      type,
      options,
      settings: {}
    })
    get().addPoll(poll)
    return poll
  },

  launch: async (pollId: string) => {
    const poll = await pollApi.update(pollId, { status: 'active' })
    get().updatePoll(poll)
  },

  close: async (pollId: string) => {
    const poll = await pollApi.update(pollId, { status: 'closed' })
    get().updatePoll(poll)
  },

  setupSocketListeners: () => {
    setSocketCallbacks({
      onPollNew: (poll) => {
        get().addPoll(poll)
      },
      onPollUpdate: (poll) => {
        get().updatePoll(poll)
      },
    })
  },
}))
