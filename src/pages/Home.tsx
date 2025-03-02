import { useNavigate } from 'react-router-dom'
import { HandRaisedIcon, TrophyIcon, GiftIcon } from '@heroicons/react/24/outline'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate('/leaderboard')
  }

  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-title">
              <h1 className="gradient-text">trenchwars</h1>
            </div>
            <div className="hero-socials">
              <a href="https://twitter.com/trenchwarzs" target="_blank" rel="noopener noreferrer" className="hero-social-link">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
            <p className="subtitle">
              <span className="subtitle-part">hold</span>
              <span className="subtitle-separator">,&nbsp;</span>
              <span className="subtitle-part">perform</span>
              <span className="subtitle-separator">,&nbsp;</span>
              <span className="subtitle-part">win</span>
            </p>
            <button className="glossy-button" onClick={handleEnter}>
              Enter
            </button>
          </div>
        </section>

        <section className="kings-podium">
          <div className="podiums">
            <div className="podium-card">
              <div className="timeframe-badge">24H</div>
              <div className="crown-icon">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <div className="winner-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h3 className="winner-address">--</h3>
              <div className="winner-stats">
                <div className="stat">
                  <span className="label">Profit</span>
                  <span className="value">--</span>
                </div>
                <div className="stat">
                  <span className="label">Prize</span>
                  <span className="value">$2,000</span>
                </div>
              </div>
              <div className="social-links">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-telegram"></i>
                </a>
              </div>
            </div>

            <div className="podium-card">
              <div className="timeframe-badge">7D</div>
              <div className="crown-icon">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <div className="winner-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h3 className="winner-address">--</h3>
              <div className="winner-stats">
                <div className="stat">
                  <span className="label">Profit</span>
                  <span className="value">--</span>
                </div>
                <div className="stat">
                  <span className="label">Prize</span>
                  <span className="value">$5,000</span>
                </div>
              </div>
              <div className="social-links">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-telegram"></i>
                </a>
              </div>
            </div>

            <div className="podium-card">
              <div className="timeframe-badge">30D</div>
              <div className="crown-icon">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <div className="winner-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h3 className="winner-address">--</h3>
              <div className="winner-stats">
                <div className="stat">
                  <span className="label">Profit</span>
                  <span className="value">--</span>
                </div>
                <div className="stat">
                  <span className="label">Prize</span>
                  <span className="value">$10,000</span>
                </div>
              </div>
              <div className="social-links">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="bi bi-telegram"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <HandRaisedIcon />
              </div>
              <h3>Hold</h3>
              <p>Hold $trenchwars tokens to participate in the competition</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <TrophyIcon />
              </div>
              <h3>Perform</h3>
              <p>Trade and showcase your skills on the leaderboard</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <GiftIcon />
              </div>
              <h3>Win</h3>
              <p>Claim victory and rewards as a top performer</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home
