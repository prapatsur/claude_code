import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ParticipantView from './pages/ParticipantView'
import PresentationView from './pages/PresentationView'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CreateSession from './pages/CreateSession'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/session/:sessionCode" element={<ParticipantView />} />
        <Route path="/session/:sessionCode/presentation" element={<PresentationView />} />
        <Route path="/organizer/:sessionId" element={<OrganizerDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
