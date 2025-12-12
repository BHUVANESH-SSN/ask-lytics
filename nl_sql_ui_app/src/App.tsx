import { Routes, Route } from 'react-router-dom'
import { Sidebar } from '../components/sidebar'
import HomePage from '../app/page'
import QueryPage from '../app/query/page'
import EditorPage from '../app/editor/page'
import HistoryPage from '../app/history/page'
import SchemaPage from '../app/schema/page'
import SettingsPage from '../app/settings/page'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/schema" element={<SchemaPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
