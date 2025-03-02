import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { ModalProvider } from './context/ModalContext'
// Removed WebSocketProvider import
import Navbar from './components/Navbar'
import Leaderboard from './pages/Leaderboard'
import Docs from './pages/Docs'
import './App.css'
import { useEffect } from 'react'

function ScrollToTop() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  
  return null
}

function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <Router>
          <div className="app">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Leaderboard />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </div>
        </Router>
      </ModalProvider>
    </ToastProvider>
  )
}

export default App
