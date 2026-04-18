import { Route, BrowserRouter, Routes } from 'react-router-dom'

import { AssistantDock } from '@/features/assistant/AssistantDock'
import { ClaimDashboard } from '@/features/claim/ClaimDashboard'
import { IncidentDetailPage } from '@/features/incidents/IncidentDetailPage'

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-dvh">
        <main className="min-h-dvh min-w-0">
          <Routes>
            <Route path="/" element={<ClaimDashboard />} />
            <Route path="/incidents/:incidentId" element={<IncidentDetailPage />} />
          </Routes>
        </main>
        <AssistantDock />
      </div>
    </BrowserRouter>
  )
}

export default App
