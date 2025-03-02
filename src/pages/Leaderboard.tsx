import { useState, useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/24/solid'
import TeamFeed from '../components/TeamFeed'
import RegisterTeamModal from '../components/RegisterTeamModal'
import '../styles/Leaderboard.css'

type TimeFrame = '24h' | '7d' | '30d'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const calculateTimeLeft = (resetTime: Date): TimeLeft => {
  const difference = resetTime.getTime() - new Date().getTime()
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}

const getResetTime = (timeframe: TimeFrame): Date => {
  const now = new Date()
  const resetTime = new Date(now)

  switch (timeframe) {
    case '24h':
      // Reset at next midnight UTC
      resetTime.setUTCHours(24, 0, 0, 0)
      break
    case '7d': {
      // Reset on next Sunday midnight UTC
      const daysUntilSunday = 7 - resetTime.getUTCDay()
      if (daysUntilSunday === 0) {
        // If today is Sunday, reset next Sunday
        resetTime.setUTCDate(resetTime.getUTCDate() + 7)
      } else {
        resetTime.setUTCDate(resetTime.getUTCDate() + daysUntilSunday)
      }
      resetTime.setUTCHours(0, 0, 0, 0)
      break
    }
    case '30d': {
      // Reset on first day of next month UTC
      resetTime.setUTCMonth(resetTime.getUTCMonth() + 1, 1)
      resetTime.setUTCHours(0, 0, 0, 0)
      break
    }
  }

  return resetTime
}

function Leaderboard() {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeFrame>('24h')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    const resetTime = getResetTime(activeTimeframe)
    setTimeLeft(calculateTimeLeft(resetTime))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(resetTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [activeTimeframe])

  const generateLeaderboardData = (totalPrizePool: number) => {
    // Distribution percentages for top 15 positions
    const percentages = [
      0.25,    // 1st: 25%
      0.15,    // 2nd: 15%
      0.12,    // 3rd: 12%
      0.09,    // 4th: 9%
      0.08,    // 5th: 8%
      0.06,    // 6th: 6%
      0.05,    // 7th: 5%
      0.04,    // 8th: 4%
      0.03,    // 9th: 3%
      0.03,    // 10th: 3%
      0.025,   // 11th: 2.5%
      0.025,   // 12th: 2.5%
      0.02,    // 13th: 2%
      0.02,    // 14th: 2%
      0.02     // 15th: 2%
    ]

    // Calculate prizes for top 15
    const prizes = percentages.map(percentage => 
      Math.floor(totalPrizePool * percentage)
    )

    // Adjust first prize to account for rounding
    const currentTotal = prizes.reduce((sum, prize) => sum + prize, 0)
    prizes[0] += totalPrizePool - currentTotal

    // Create full leaderboard data with 0 prizes after top 15
    return Array.from({ length: 98 }, (_, i) => ({
      rank: i + 1,
      prize: i < 15 ? prizes[i] : 0,
      profit: (totalPrizePool * 0.2 - i * 10).toFixed(2)
    }))
  }

  const leaderboardData = {
    '24h': generateLeaderboardData(2000),
    '7d': generateLeaderboardData(5000),
    '30d': generateLeaderboardData(10000)
  }

  const handleTimeframeChange = (timeframe: TimeFrame) => {
    setActiveTimeframe(timeframe)
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-layout">
          <TeamFeed />
          <div className="leaderboard">
          <div className="pnl-type-selector">
            <button className="pnl-button active">
              Solo PnL
            </button>
            <button className="pnl-button disabled" disabled>
              Duo PnL
              <span className="coming-soon-badge">Coming Soon</span>
            </button>
            <button className="pnl-button disabled" disabled>
              Trio PnL
              <span className="coming-soon-badge">Coming Soon</span>
            </button>
            <button className="pnl-button disabled" disabled>
              FnF PnL
              <span className="coming-soon-badge">Coming Soon</span>
            </button>
          </div>
          <button className="register-team-button" onClick={openModal}>
            Register Your Team
          </button>
          <div className="prize-info">
            <div className="prize-header">
              <div className="total-prize">
                ${leaderboardData[activeTimeframe].reduce((sum, entry) => sum + entry.prize, 0).toLocaleString()}
              </div>
              <div className="prize-label">Total Prize Pool</div>
              <div className="reset-timer">
                <ClockIcon className="timer-icon" />
                {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
            <div className="timeframe-selector">
              <button 
                className={`timeframe-button ${activeTimeframe === '24h' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('24h')}
              >
                <span>24 Hours</span>
              </button>
              <button 
                className={`timeframe-button ${activeTimeframe === '7d' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('7d')}
              >
                <span>7 Days</span>
              </button>
              <button 
                className={`timeframe-button ${activeTimeframe === '30d' ? 'active' : ''}`}
                onClick={() => handleTimeframeChange('30d')}
              >
                <span>30 Days</span>
              </button>
            </div>
          </div>
          <div className="leaderboard-header">
            <span>Rank</span>
            <span>Wallet</span>
            <span className="align-right">PnL</span>
            <span className="align-right">Prize Pool</span>
          </div>
          <div className="leaderboard-rows">
            {leaderboardData[activeTimeframe].map((entry) => (
              <div key={entry.rank} className="leaderboard-row">
                <span>#{entry.rank}</span>
                <span className="address">--</span>
                <span className="align-right">--</span>
                <span className="align-right prize-amount">${entry.prize.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RegisterTeamModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
    </div>
  )
}

export default Leaderboard
