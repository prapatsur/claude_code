import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSessionStore } from '@/stores/sessionStore'
import { useQuestionStore } from '@/stores/questionStore'

export default function PresentationView() {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const navigate = useNavigate()

  const { session, isLoading, error, join, leave } = useSessionStore()
  const { questions, fetchQuestions, setupSocketListeners } = useQuestionStore()

  useEffect(() => {
    if (!sessionCode) {
      navigate('/')
      return
    }

    // Set up socket listeners
    setupSocketListeners()

    // Join as presentation view
    join(sessionCode, 'Presentation')

    return () => {
      leave()
    }
  }, [sessionCode])

  // Fetch questions when session is joined
  useEffect(() => {
    if (session) {
      fetchQuestions(session.id)

      // Set up auto-refresh for questions every 5 seconds
      const interval = setInterval(() => {
        fetchQuestions(session.id)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [session])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Session Not Found</h2>
          <p className="text-xl opacity-80">{error || 'Unable to load session'}</p>
        </div>
      </div>
    )
  }

  // Filter and sort questions
  const approvedQuestions = questions
    .filter(q => q.status === 'approved' || q.status === 'answered')
    .slice(0, 5) // Show top 5 questions

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">{session.name}</h1>
        <p className="text-2xl opacity-90">
          Live Q&A - {approvedQuestions.length} Questions
        </p>
      </div>

      {/* Questions */}
      <div className="max-w-6xl mx-auto space-y-6">
        {approvedQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl opacity-60">No questions yet</p>
            <p className="text-xl opacity-40 mt-2">Questions will appear here when submitted</p>
          </div>
        ) : (
          approvedQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex items-start gap-6 transition-all hover:bg-white/15"
            >
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold opacity-80">▲</span>
                <span className="text-4xl font-bold mt-2">{question.votes}</span>
              </div>
              <div className="flex-1 pt-4">
                <p className="text-3xl font-medium leading-relaxed">{question.text}</p>
                {question.answer && (
                  <div className="mt-4 p-4 bg-green-500/20 rounded-xl">
                    <p className="text-sm font-semibold mb-2 opacity-80">Answer:</p>
                    <p className="text-xl">{question.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
          <p className="text-2xl font-semibold">
            Session Code: <span className="font-mono font-bold">{sessionCode}</span>
          </p>
          <p className="text-lg opacity-80 mt-1">Join to ask questions and vote</p>
        </div>
      </div>
    </div>
  )
}
