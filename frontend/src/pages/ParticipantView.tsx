import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MessageSquare, BarChart3, Trophy } from 'lucide-react'

type Tab = 'qa' | 'polls' | 'quiz'

export default function ParticipantView() {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('qa')
  const [sessionName, setSessionName] = useState('Loading...')

  useEffect(() => {
    // TODO: Connect to WebSocket and join session
    console.log('Joining session:', sessionCode)
    // Temporary mock data
    setSessionName('Tech Talk 2025')
  }, [sessionCode])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {sessionName}
          </h1>
          <p className="text-xs text-gray-500">
            Session: {sessionCode}
          </p>
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
  const maxLength = 500

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (questionText.trim()) {
      // TODO: Submit question via WebSocket
      console.log('Submitting question:', questionText)
      setQuestionText('')
    }
  }

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
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {questionText.length}/{maxLength}
          </span>
          <button
            type="submit"
            disabled={!questionText.trim()}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Questions List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Top Questions</h2>
        {/* TODO: Map through real questions */}
        <QuestionCard
          question="How do we handle scaling to 1000 users?"
          votes={42}
          author="Anonymous"
          hasVoted={false}
        />
        <QuestionCard
          question="What is the expected infrastructure cost?"
          votes={38}
          author="Sarah M."
          hasVoted={true}
        />
      </div>
    </div>
  )
}

function QuestionCard({ question, votes, author, hasVoted }: {
  question: string
  votes: number
  author: string
  hasVoted: boolean
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex gap-3">
        <button
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
        </div>
      </div>
    </div>
  )
}

function PollsTab() {
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
