import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { ModalProvider } from './context/ModalContext'
import { WebSocketProvider } from './context/WebSocketContext'
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
      <WebSocketProvider>
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
      </WebSocketProvider>
    </ToastProvider>
  )
}

export default App
