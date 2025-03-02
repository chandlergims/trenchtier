import { useState, useEffect } from 'react'
import axios from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import '../styles/TeamDetailsModal.css'

interface TeamDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  teamId: string
}

interface TeamDetails {
  _id: string
  teamName: string
  teamType: 'Duo' | 'Trio' | 'FnF'
  ownerWalletAddress: string
  memberWalletAddresses: string[]
  createdAt: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function shortenAddress(address: string): string {
  if (address.length <= 12) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

function TeamDetailsModal({ isOpen, onClose, teamId }: TeamDetailsModalProps) {
  const [team, setTeam] = useState<TeamDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (isOpen && teamId) {
      setLoading(true)
      setError(null)
      
      axios.get(`http://localhost:5000/api/teams/${teamId}`)
        .then(response => {
          setTeam(response.data)
        })
        .catch(err => {
          console.error('Error fetching team details:', err)
          setError('Failed to load team details')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, teamId])
  
  if (!isOpen) return null
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the modal when clicking on the overlay
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container team-details-modal">
        <div className="modal-header">
          <h2>Team Details</h2>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading-message">Loading team details...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : team ? (
            <div className="team-details-content">
              <div className="team-header">
                <h3>{team.teamName}</h3>
                <span className={`team-type-badge ${team.teamType.toLowerCase()}`}>
                  {team.teamType}
                </span>
              </div>
              
              <div className="team-info">
                <div className="info-group">
                  <label>Created</label>
                  <div>{formatDate(team.createdAt)}</div>
                </div>
                
                <div className="info-group">
                  <label>Team Members</label>
                  <div className="member-list">
                    {/* Include owner in the list */}
                    <div className="wallet-address" title={team.ownerWalletAddress}>
                      {shortenAddress(team.ownerWalletAddress)}
                    </div>
                    
                    {/* Show all other team members */}
                    {team.memberWalletAddresses.map((address, index) => (
                      <div key={index} className="wallet-address" title={address}>
                        {shortenAddress(address)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-message">Team not found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamDetailsModal
