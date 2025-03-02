import { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import { useToast } from '../context/ToastContext'
import { PlusIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline'
import MatchDetails from '../components/MatchDetails'
import '../styles/Tournament.css'

type TeamSize = 'solo' | 'duo' | 'trio' | 'fnf'
type Duration = '24h' | '7d' | '30d'

interface TournamentForm {
  teamSize: TeamSize
  duration: Duration
  betAmount: string
}

interface Tournament {
  id: string
  teamSize: TeamSize
  duration: Duration
  betAmount: string
  createdAt: Date
  status: 'pending' | 'active' | 'completed'
}

function Tournament() {
  const { isConnected } = useWallet()
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<TournamentForm>({
    teamSize: 'solo',
    duration: '24h',
    betAmount: ''
  })
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Tournament | null>(null)

  const teamSizes: { value: TeamSize; label: string }[] = [
    { value: 'solo', label: '1v1' },
    { value: 'duo', label: '2v2' },
    { value: 'trio', label: '3v3' },
    { value: 'fnf', label: 'FnF' }
  ]

  const durations: { value: Duration; label: string }[] = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ]

  const handleCreate = () => {
    if (!isConnected) {
      showToast('Connect wallet to create tournament', 'info')
      return
    }

    const newTournament: Tournament = {
      id: Math.random().toString(36).substring(7),
      ...form,
      createdAt: new Date(),
      status: 'active'
    }

    setTournaments(prev => [newTournament, ...prev])
    setShowModal(false)
    showToast('Tournament created successfully!', 'success')

    // Simulate opponent joining after 5 seconds
    if (form.teamSize === 'solo' && form.duration === '24h' && form.betAmount === '3') {
      setTimeout(() => {
        showToast('An opponent has joined your match!', 'success')
        setSelectedMatch(newTournament)
      }, 5000)
    }
  }

  const handleViewMatch = (match: Tournament) => {
    setSelectedMatch(match)
  }

  const handleCancel = (matchId: string) => {
    setTournaments(prev => prev.filter(t => t.id !== matchId))
    showToast('Match cancelled successfully!', 'success')
  }

  const formatDuration = (duration: Duration) => {
    switch (duration) {
      case '24h': return '24 Hours'
      case '7d': return '7 Days'
      case '30d': return '30 Days'
      default: return duration
    }
  }

  const formatTeamSize = (size: TeamSize) => {
    switch (size) {
      case 'solo': return '1v1'
      case 'duo': return '2v2'
      case 'trio': return '3v3'
      case 'fnf': return 'FnF'
      default: return size
    }
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const openMatches: Tournament[] = [
    {
      id: '1',
      teamSize: 'solo',
      duration: '24h',
      betAmount: '0.5',
      createdAt: new Date(Date.now() - 2 * 60000), // 2 minutes ago
      status: 'pending'
    },
    {
      id: '2',
      teamSize: 'trio',
      duration: '7d',
      betAmount: '2.5',
      createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      status: 'pending'
    },
    {
      id: '3',
      teamSize: 'duo',
      duration: '30d',
      betAmount: '5',
      createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      status: 'pending'
    }
  ]

  return (
    <div className="tournament-page">
      <div className="container">
        <button className="create-button" onClick={() => setShowModal(true)}>
          <PlusIcon className="icon" />
          Create
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>New Tournament</h2>
                <button className="close-button" onClick={() => setShowModal(false)}>
                  <XMarkIcon className="icon" />
                </button>
              </div>
              <div className="modal-content">
                <div className="form-group">
                  <label>Team Size</label>
                  <div className="button-group">
                    {teamSizes.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        className={`size-button ${form.teamSize === value ? 'active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, teamSize: value }))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <div className="button-group">
                    {durations.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        className={`duration-button ${form.duration === value ? 'active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, duration: value }))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Bet Amount (SOL)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={form.betAmount}
                      onChange={(e) => setForm(prev => ({ ...prev, betAmount: e.target.value }))}
                      placeholder="Enter bet amount"
                      min="0"
                      step="0.01"
                      required
                    />
                    <span className="currency">SOL</span>
                  </div>
                </div>

                <button className="submit-button" onClick={handleCreate}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tournament-sections">
          <section className="tournament-section">
            <div className="section-header">
              <div className="header-content">
                <h2>Your Matches</h2>
                <div className="section-line"></div>
              </div>
            </div>
            <div className="tournament-grid">
              {tournaments.filter(t => t.status === 'active').length > 0 ? (
                tournaments.filter(t => t.status === 'active').map(tournament => (
                  <div key={tournament.id} className="tournament-card">
                    <div className="card-content">
                      <div className="card-header">
                        <div className="team-size">
                          {formatTeamSize(tournament.teamSize)} - {tournament.betAmount} <span>SOL</span>
                        </div>
                        <div className="duration">{formatDuration(tournament.duration)}</div>
                      </div>
                      <div className="match-info">
                        <div className="info-item">
                          <span className="label">Status</span>
                          <span className={`value status-${tournament.status}`}>{tournament.status.toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Time Left</span>
                          <span className="value">23h 45m</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="cancel-button"
                          onClick={() => handleCancel(tournament.id)}
                        >
                          Cancel Match
                        </button>
                        <button className="view-details-button" onClick={() => handleViewMatch(tournament)}>
                          <EyeIcon className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No active matches</p>
                  <span>Join or create a tournament to get started!</span>
                </div>
              )}
            </div>
          </section>

          <section className="tournament-section">
            <div className="section-header">
              <div className="header-content">
                <h2>Open Matches</h2>
                <div className="section-line"></div>
              </div>
            </div>
            <div className="tournament-grid">
              {openMatches.map((tournament) => {
                const getPlayerCount = (size: TeamSize) => {
                  switch (size) {
                    case 'solo': return '1/2'
                    case 'duo': return '2/4'
                    case 'trio': return '3/6'
                    case 'fnf': return '5/10'
                    default: return '1/2'
                  }
                }

                return (
                  <div key={tournament.id} className="tournament-card">
                    <div className="card-content">
                      <div className="card-header">
                        <div className="team-size">
                          {formatTeamSize(tournament.teamSize)} - {tournament.betAmount} <span>SOL</span>
                        </div>
                        <div className="duration">{formatDuration(tournament.duration)}</div>
                      </div>
                      <div className="match-info">
                        <div className="info-item">
                          <span className="label">Created</span>
                          <span className="value">{formatTimeAgo(tournament.createdAt)}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Players</span>
                          <span className="value">{getPlayerCount(tournament.teamSize)}</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button className="join-button">
                          Join Match
                        </button>
                        <button className="view-details-button" onClick={() => handleViewMatch(tournament)}>
                          <EyeIcon className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {selectedMatch && (
          <MatchDetails 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)} 
          />
        )}
      </div>
    </div>
  )
}

export default Tournament
