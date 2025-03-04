import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
// X Logo SVG component
const XLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="x-logo"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
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
            <span className="brand-text">TrenchRank</span>
          </Link>
        </div>
        <div className="navbar-menu">
          <Link 
            to="/docs" 
            className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`}
          >
            Docs
          </Link>
          <a 
            href="https://x.com/TrenchRank" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Follow us on X (Twitter)"
          >
            <XLogo />
          </a>
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
