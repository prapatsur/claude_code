import { create } from 'zustand'
import type { Session } from '@/types'
import { sessionApi } from '@/services/api'
import { joinSession, setSocketCallbacks, disconnectSocket } from '@/services/socket'

interface SessionState {
  session: Session | null
  userId: string | null
  nickname: string | null
  isConnected: boolean
  isLoading: boolean
  error: string | null

  // Actions
  join: (sessionCode: string, nickname?: string) => Promise<boolean>
  leave: () => void
  setSession: (session: Session) => void
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  userId: null,
  nickname: null,
  isConnected: false,
  isLoading: false,
  error: null,

  join: async (sessionCode: string, nickname?: string) => {
    set({ isLoading: true, error: null })

    try {
      // Set up socket callbacks
      setSocketCallbacks({
        onSessionUpdate: (session) => {
          set({ session })
        },
        onConnect: () => {
          set({ isConnected: true })
        },
        onDisconnect: () => {
          set({ isConnected: false })
        },
        onError: (data) => {
          set({ error: data.message })
        },
      })

      // Join via WebSocket
      const response = await joinSession(sessionCode, nickname)

      if (response.error) {
        set({ isLoading: false, error: response.error })
        return false
      }

      if (response.success && response.session && response.userId) {
        set({
          session: response.session,
          userId: response.userId,
          nickname: nickname || 'Anonymous',
          isLoading: false,
          isConnected: true,
        })

        // Store in localStorage for reconnection
        localStorage.setItem('sessionId', response.sessionId || '')
        localStorage.setItem('userId', response.userId)
        if (nickname) {
          localStorage.setItem('userNickname', nickname)
        }

        return true
      }

      set({ isLoading: false, error: 'Failed to join session' })
      return false
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join session'
      set({ isLoading: false, error: message })
      return false
    }
  },

  leave: () => {
    disconnectSocket()
    localStorage.removeItem('sessionId')
    localStorage.removeItem('userId')
    set({
      session: null,
      userId: null,
      nickname: null,
      isConnected: false,
      error: null,
    })
  },

  setSession: (session) => set({ session }),
  setConnected: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error }),
}))
