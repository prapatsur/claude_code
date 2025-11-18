import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function HomePage() {
  const [sessionCode, setSessionCode] = useState('')
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (sessionCode.trim()) {
      // Store nickname in localStorage for the session
      if (nickname.trim()) {
        localStorage.setItem('userNickname', nickname.trim())
      }
      navigate(`/session/${sessionCode.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Audience Engagement
            </h1>
            <p className="text-gray-600">
              Join a live session to participate in Q&A, polls, and quizzes
            </p>
          </div>

          {/* Join Form */}
          <form onSubmit={handleJoinSession} className="space-y-4">
            <div>
              <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700 mb-2">
                Session Code
              </label>
              <input
                id="sessionCode"
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all uppercase"
                maxLength={8}
                required
              />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                Your Nickname (Optional)
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., John D."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                maxLength={50}
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to participate anonymously
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Join Session
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              No account needed. Just enter the session code provided by your organizer.
            </p>
          </div>
        </div>

        {/* Create Session Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/create')}
            className="text-white underline hover:no-underline opacity-90 hover:opacity-100 text-sm"
          >
            Or create a new session as an organizer
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-white text-sm">
          <p className="opacity-70">
            Powered by Audience Engagement Platform
          </p>
        </div>
      </div>
    </div>
  )
}
