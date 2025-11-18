import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function PresentationView() {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const [sessionName, setSessionName] = useState('Tech Talk 2025')
  const [participantCount, setParticipantCount] = useState(156)

  useEffect(() => {
    // TODO: Connect to WebSocket and subscribe to session updates
    console.log('Presentation view for session:', sessionCode)
  }, [sessionCode])

  // Mock data for questions
  const topQuestions = [
    { id: '1', text: 'How do we handle scaling to 1000 users?', votes: 42 },
    { id: '2', text: 'What is the expected infrastructure cost?', votes: 38 },
    { id: '3', text: "What's the implementation timeline?", votes: 25 },
    { id: '4', text: 'Can we integrate with our existing auth?', votes: 18 },
    { id: '5', text: 'Will this work offline?', votes: 15 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">{sessionName}</h1>
        <p className="text-2xl opacity-90">Live Q&A - {participantCount} Participants</p>
      </div>

      {/* Questions */}
      <div className="max-w-6xl mx-auto space-y-6">
        {topQuestions.map((question, index) => (
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
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-0 right-0 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
          <p className="text-2xl font-semibold">
            Session Code: <span className="font-mono font-bold">{sessionCode}</span>
          </p>
          <p className="text-lg opacity-80 mt-1">Join at: pigeonhole.yourcompany.com</p>
        </div>
      </div>
    </div>
  )
}
