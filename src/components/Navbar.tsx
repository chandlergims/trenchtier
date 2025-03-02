import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import '../styles/Navbar.css'

function Navbar() {
  const location = useLocation()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', initialTheme)
    return initialTheme
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <img src="/logo.png" alt="trenchwars logo" className="brand-logo" />
            <span className="brand-text">TrenchComp</span>
          </Link>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/docs" 
            className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`}
          >
            Docs
          </Link>
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon className="theme-icon" />
            ) : (
              <SunIcon className="theme-icon" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
