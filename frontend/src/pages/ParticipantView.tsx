import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, BarChart3, Trophy, Loader2, WifiOff, CheckCircle2 } from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { useQuestionStore } from '@/stores/questionStore'
import { usePollStore } from '@/stores/pollStore'

type Tab = 'qa' | 'polls' | 'quiz'

export default function ParticipantView() {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('qa')

  const { session, userId, isConnected, isLoading, error, join, leave } = useSessionStore()
  const { fetchQuestions, setupSocketListeners: setupQuestionListeners } = useQuestionStore()
  const { fetchPolls, setupSocketListeners: setupPollListeners } = usePollStore()

  useEffect(() => {
    if (!sessionCode) {
      navigate('/')
      return
    }

    const savedNickname = localStorage.getItem('userNickname') || undefined

    // Set up socket listeners
    setupQuestionListeners()
    setupPollListeners()

    // Join session
    join(sessionCode, savedNickname)

    return () => {
      leave()
    }
  }, [sessionCode])

  // Fetch data when session is joined
  useEffect(() => {
    if (session && userId) {
      fetchQuestions(session.id, userId)
      fetchPolls(session.id)
    }
  }, [session, userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Joining session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Join</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {session.name}
              </h1>
              <p className="text-xs text-gray-500">
                Session: {sessionCode}
              </p>
            </div>
            <div className={`flex items-center gap-1 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Reconnecting...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'qa'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Q&A
          </button>
          <button
            onClick={() => setActiveTab('polls')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'polls'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Polls
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'quiz'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Quiz
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'qa' && <QATab />}
        {activeTab === 'polls' && <PollsTab />}
        {activeTab === 'quiz' && <QuizTab />}
      </main>
    </div>
  )
}

function QATab() {
  const [questionText, setQuestionText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const maxLength = 500

  const { session } = useSessionStore()
  const { questions, isLoading, submit, vote, unvote, votedQuestionIds } = useQuestionStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim() || !session) return

    setIsSubmitting(true)
    submit(session.id, questionText.trim(), isAnonymous)

    // Show success feedback
    setQuestionText('')
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setTimeout(() => setSubmitSuccess(false), 3000)
  }

  const handleVoteToggle = (questionId: string) => {
    if (votedQuestionIds.has(questionId)) {
      unvote(questionId)
    } else {
      vote(questionId)
    }
  }

  // Filter to only show approved questions
  const approvedQuestions = questions.filter(q => q.status === 'approved' || q.status === 'answered')

  return (
    <div className="p-4 space-y-4">
      {/* Ask Question */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Ask a Question</h2>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Type your question here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          rows={3}
          maxLength={maxLength}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {questionText.length}/{maxLength}
            </span>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Ask anonymously
            </label>
          </div>
          <button
            type="submit"
            disabled={!questionText.trim() || isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        {submitSuccess && (
          <p className="mt-2 text-sm text-green-600">
            Question submitted successfully!
          </p>
        )}
      </form>

      {/* Questions List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Top Questions {approvedQuestions.length > 0 && `(${approvedQuestions.length})`}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : approvedQuestions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No questions yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to ask!</p>
          </div>
        ) : (
          approvedQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question.text}
              votes={question.votes}
              author={question.isAnonymous ? 'Anonymous' : (question.userNickname || 'Unknown')}
              hasVoted={votedQuestionIds.has(question.id)}
              answer={question.answer}
              onVoteToggle={() => handleVoteToggle(question.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function QuestionCard({ question, votes, author, hasVoted, answer, onVoteToggle }: {
  question: string
  votes: number
  author: string
  hasVoted: boolean
  answer?: string
  onVoteToggle: () => void
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex gap-3">
        <button
          onClick={onVoteToggle}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
            hasVoted
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="text-lg font-bold">▲</span>
          <span className="text-sm font-semibold">{votes}</span>
        </button>
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{question}</p>
          <p className="text-xs text-gray-500 mt-1">— {author}</p>
          {answer && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-1">Answer:</p>
              <p className="text-sm text-green-800">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PollsTab() {
  const { activePoll, results, respondedPollIds, respond } = usePollStore()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleSubmit = () => {
    if (activePoll && selectedOption !== null) {
      respond(activePoll.id, selectedOption)
      setSelectedOption(null)
    }
  }

  const hasResponded = activePoll ? respondedPollIds.has(activePoll.id) : false
  const pollResults = activePoll ? results[activePoll.id] : null

  if (!activePoll) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No active polls</p>
          <p className="text-sm text-gray-400 mt-1">Polls will appear here when the organizer launches them</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{activePoll.question}</h2>

        {!hasResponded ? (
          <>
            <div className="space-y-2 mb-4">
              {activePoll.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedOption === index
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Vote
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-green-600 font-medium mb-4">Thanks for voting!</p>
            {pollResults?.options?.map((option, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{option.text}</span>
                  <span className="font-medium">{option.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Total responses: {pollResults?.totalResponses || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function QuizTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No active quiz</p>
        <p className="text-sm text-gray-400 mt-1">Quiz will start when the organizer begins</p>
      </div>
    </div>
  )
}
