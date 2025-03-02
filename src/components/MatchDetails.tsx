import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useToast } from '../context/ToastContext'
import '../styles/MatchDetails.css'

interface MatchDetailsProps {
  match: {
    id: string
    teamSize: 'solo' | 'duo' | 'trio' | 'fnf'
    duration: '24h' | '7d' | '30d'
    betAmount: string
    createdAt: Date
    status: 'pending' | 'active' | 'completed'
  }
  onClose: () => void
}

function MatchDetails({ match, onClose }: MatchDetailsProps) {
  const { showToast } = useToast()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [notificationShown, setNotificationShown] = useState(false)

  useEffect(() => {
    if (match.teamSize === 'solo' && match.duration === '24h' && match.betAmount === '3' && !notificationShown) {
      setTimeout(() => {
        showToast('Deposit received successfully!', 'success')
        setNotificationShown(true)
      }, 5000)
    }
  }, [match, showToast, notificationShown])

  const formatTeamSize = (size: 'solo' | 'duo' | 'trio' | 'fnf') => {
    switch (size) {
      case 'solo': return '1v1'
      case 'duo': return '2v2'
      case 'trio': return '3v3'
      case 'fnf': return 'FnF'
      default: return size
    }
  }

  const formatDuration = (duration: '24h' | '7d' | '30d') => {
    switch (duration) {
      case '24h': return '24 Hours'
      case '7d': return '7 Days'
      case '30d': return '30 Days'
      default: return duration
    }
  }

  const calculatePrizePool = (betAmount: string) => {
    const amount = parseFloat(betAmount)
    return (amount * 2).toFixed(2) // Each player contributes betAmount
  }

  return (
    <div className="match-details-overlay">
      <div className="match-details">
        <div className="match-details-header">
          <h2>{formatTeamSize(match.teamSize)} Match</h2>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon className="icon" />
          </button>
        </div>
        
        <div className="match-details-content">
          <div className="prize-header">
            <div className="prize-amount">
              <div className="prize-label">Total Prize Pool</div>
              <span className="amount">{calculatePrizePool(match.betAmount)}</span>
              <span className="currency">SOL</span>
            </div>
          </div>

          <div className="match-info-grid">
            <div className="info-card">
              <h3>Match Info</h3>
              <div className="info-row">
                <span className="label">Duration</span>
                <span className="value">{formatDuration(match.duration)}</span>
              </div>
              <div className="info-row">
                <span className="label">Entry</span>
                <span className="value">{match.betAmount} SOL</span>
              </div>
              <div className="info-row">
                <span className="label">Status</span>
                <span className={`value status-${match.status}`}>{match.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Players</h3>
              <div className="players-list">
                <div className="player">
                  <div className="player-avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="player-info">
                    <span className="player-name">You</span>
                    <span className="player-address">DYf3...h82K</span>
                  </div>
                </div>
                {match.status === 'active' ? (
                  <div className="player">
                    <div className="player-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="player-info">
                      <span className="player-name">Rey</span>
                      <span className="player-address">x8Kj...p92M</span>
                    </div>
                  </div>
                ) : (
                  <div className="player empty">
                    <div className="player-avatar">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="player-info">
                      <span className="player-name">Waiting for opponent...</span>
                      <span className="player-address">---</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDepositModal && (
        <div className="deposit-modal-overlay">
          <div className="deposit-modal">
            <h3>Send {match.betAmount} SOL to:</h3>
            <div className="wallet-address">
              DYf3h82KxZVt9KWh82K
            </div>
            <button className="close-modal" onClick={() => setShowDepositModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchDetails
