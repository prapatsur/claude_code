import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, MessageSquare, BarChart3, Settings, ExternalLink } from 'lucide-react'

export default function OrganizerDashboard() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [sessionCode] = useState('TECH2025')
  const [participantCount] = useState(156)

  useEffect(() => {
    // TODO: Connect to WebSocket and load session data
    console.log('Organizer dashboard for session:', sessionId)
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tech Talk 2025</h1>
              <p className="text-sm text-gray-500">Session Code: {sessionCode}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`/session/${sessionCode}/presentation`}
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
            icon={<Users className="w-6 h-6" />}
            label="Participants"
            value={participantCount}
            color="blue"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Questions"
            value={24}
            color="green"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6" />}
            label="Active Polls"
            value={3}
            color="purple"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Q&A Queue */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Q&A Queue</h2>
              <div className="space-y-3">
                <QuestionModerationCard
                  question="How do we handle scaling to 1000 users?"
                  author="Anonymous"
                  votes={42}
                  status="approved"
                />
                <QuestionModerationCard
                  question="What is the expected infrastructure cost?"
                  author="Sarah M."
                  votes={38}
                  status="approved"
                />
                <QuestionModerationCard
                  question="This is a test question that needs moderation"
                  author="Test User"
                  votes={2}
                  status="pending"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pending Moderation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Moderation
                <span className="ml-2 text-sm font-normal text-gray-500">(8)</span>
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>New questions awaiting approval...</p>
              </div>
            </div>

            {/* Create Poll */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Poll</h2>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Multiple Choice
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Rating Scale
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Word Cloud
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

function QuestionModerationCard({ question, author, votes, status }: {
  question: string
  author: string
  votes: number
  status: 'pending' | 'approved' | 'rejected'
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-gray-400">▲</span>
          <span className="text-sm font-semibold text-gray-600">{votes}</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium">{question}</p>
          <p className="text-xs text-gray-500 mt-1">— {author}</p>
          {status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded hover:bg-green-200 transition-colors">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors">
                Reject
              </button>
            </div>
          )}
          {status === 'approved' && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              Approved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
