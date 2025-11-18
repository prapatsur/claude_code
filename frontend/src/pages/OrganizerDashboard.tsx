import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, MessageSquare, BarChart3, Settings, ExternalLink, Plus, X, Loader2, Play, Square, Check, XCircle } from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { useQuestionStore } from '@/stores/questionStore'
import { usePollStore } from '@/stores/pollStore'
import { sessionApi } from '@/services/api'
import type { Question } from '@/types'

export default function OrganizerDashboard() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [showCreatePoll, setShowCreatePoll] = useState(false)

  const { session, isLoading, error, join, leave } = useSessionStore()
  const { questions, fetchQuestions, moderate, setupSocketListeners: setupQuestionListeners } = useQuestionStore()
  const { polls, fetchPolls, setupSocketListeners: setupPollListeners } = usePollStore()

  useEffect(() => {
    if (!sessionId) {
      navigate('/')
      return
    }

    // Set up socket listeners
    setupQuestionListeners()
    setupPollListeners()

    // Load session data
    const loadSession = async () => {
      try {
        const sessionData = await sessionApi.getById(sessionId)
        if (sessionData) {
          join(sessionData.code, 'Organizer')
        }
      } catch (err) {
        console.error('Failed to load session:', err)
      }
    }

    loadSession()

    return () => {
      leave()
    }
  }, [sessionId])

  // Fetch data when session is loaded
  useEffect(() => {
    if (session) {
      fetchQuestions(session.id)
      fetchPolls(session.id)

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchQuestions(session.id)
        fetchPolls(session.id)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load session'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const pendingQuestions = questions.filter(q => q.status === 'pending')
  const approvedQuestions = questions.filter(q => q.status === 'approved' || q.status === 'answered')
  const activePolls = polls.filter(p => p.status === 'active')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
              <p className="text-sm text-gray-500">Session Code: {session.code}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`/session/${session.code}/presentation`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Presentation View
              </a>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Total Questions"
            value={questions.length}
            color="blue"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Pending Moderation"
            value={pendingQuestions.length}
            color="green"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Active Polls"
            value={activePolls.length}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Q&A Queue */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pending Questions */}
            {pendingQuestions.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pending Moderation
                  <span className="ml-2 text-sm font-normal text-orange-600">({pendingQuestions.length})</span>
                </h2>
                <div className="space-y-3">
                  {pendingQuestions.map(question => (
                    <QuestionModerationCard
                      key={question.id}
                      question={question}
                      onApprove={() => moderate(question.id, 'approved')}
                      onReject={() => moderate(question.id, 'rejected')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Approved Questions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Approved Questions
                <span className="ml-2 text-sm font-normal text-gray-500">({approvedQuestions.length})</span>
              </h2>
              {approvedQuestions.length === 0 ? (
                <p className="text-gray-500 text-sm">No approved questions yet</p>
              ) : (
                <div className="space-y-3">
                  {approvedQuestions.map(question => (
                    <QuestionModerationCard
                      key={question.id}
                      question={question}
                      onApprove={() => {}}
                      onReject={() => moderate(question.id, 'rejected')}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Create Poll */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Poll</h2>
              <button
                onClick={() => setShowCreatePoll(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Poll
              </button>
            </div>

            {/* Active Polls */}
            {activePolls.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Polls</h2>
                <div className="space-y-3">
                  {activePolls.map(poll => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <CreatePollModal
          sessionId={session.id}
          onClose={() => setShowCreatePoll(false)}
        />
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function QuestionModerationCard({ question, onApprove, onReject }: {
  question: Question
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-400">▲</span>
          <span className="text-sm font-semibold text-gray-600">{question.votes}</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{question.text}</p>
          <p className="text-xs text-gray-500 mt-1">
            — {question.isAnonymous ? 'Anonymous' : (question.userNickname || 'Unknown')}
          </p>
          {question.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onApprove}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded hover:bg-green-200 transition-colors"
              >
                <Check className="w-3 h-3" />
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors"
              >
                <XCircle className="w-3 h-3" />
                Reject
              </button>
            </div>
          )}
          {question.status === 'approved' && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              Approved
            </span>
          )}
          {question.status === 'answered' && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Answered
              </span>
              {question.answer && (
                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {question.answer}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PollCard({ poll }: { poll: any }) {
  const { close } = usePollStore()

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-medium text-gray-900 mb-2">{poll.question}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-green-600 font-medium">Active</span>
        <button
          onClick={() => close(poll.id)}
          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors"
        >
          <Square className="w-3 h-3" />
          Close
        </button>
      </div>
    </div>
  )
}

function CreatePollModal({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { create, launch } = usePollStore()

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || options.some(o => !o.trim())) return

    setIsSubmitting(true)
    try {
      const poll = await create(sessionId, question.trim(), 'multiple_choice', options.filter(o => o.trim()))
      await launch(poll.id)
      onClose()
    } catch (error) {
      console.error('Failed to create poll:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create Poll</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add option
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim() || options.some(o => !o.trim())}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Create & Launch
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
