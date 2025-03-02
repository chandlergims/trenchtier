import { useState } from 'react'
import axios from 'axios'
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import '../styles/RegisterTeamModal.css'

// Solana address validation
const isSolanaAddress = (address: string): boolean => {
  // Solana addresses are base58-encoded public keys
  // They are typically 32-44 characters long
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return solanaAddressRegex.test(address)
}

interface RegisterTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

type TeamType = 'Duo' | 'Trio' | 'FNF'

function RegisterTeamModal({ isOpen, onClose }: RegisterTeamModalProps) {
  const [teamType, setTeamType] = useState<TeamType>('Duo')
  const [teamName, setTeamName] = useState('')
  const [walletAddresses, setWalletAddresses] = useState<string[]>([''])
  const [yourWalletAddress, setYourWalletAddress] = useState('')
  
  const handleTeamTypeChange = (type: TeamType) => {
    setTeamType(type)
    
    // Reset wallet addresses based on team type
    if (type === 'Duo') {
      setWalletAddresses([''])
    } else if (type === 'Trio') {
      setWalletAddresses(['', ''])
    } else {
      setWalletAddresses([''])
    }
  }
  
  const addWalletAddress = () => {
    setWalletAddresses([...walletAddresses, ''])
  }
  
  const removeWalletAddress = (index: number) => {
    const newAddresses = [...walletAddresses]
    newAddresses.splice(index, 1)
    setWalletAddresses(newAddresses)
  }
  
  const updateWalletAddress = (index: number, value: string) => {
    const newAddresses = [...walletAddresses]
    newAddresses[index] = value
    setWalletAddresses(newAddresses)
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate owner wallet address
      if (!isSolanaAddress(yourWalletAddress)) {
        throw new Error('Your wallet address must be a valid Solana address')
      }
      
      // Filter out any empty wallet addresses for FNF teams
      const filteredAddresses = teamType === 'FNF' 
        ? walletAddresses.filter(address => address.trim() !== '')
        : walletAddresses
      
      // Ensure we have at least one member for FNF teams
      if (teamType === 'FNF' && filteredAddresses.length === 0) {
        throw new Error('FNF teams must have at least one member')
      }
      
      // Validate member wallet addresses
      for (const address of filteredAddresses) {
        if (!isSolanaAddress(address)) {
          throw new Error('All wallet addresses must be valid Solana addresses')
        }
      }
      
      const response = await axios.post(`${apiUrl}/api/teams/register`, {
        teamName,
        teamType,
        ownerWalletAddress: yourWalletAddress,
        memberWalletAddresses: filteredAddresses
      })
      
      console.log('Team registered successfully:', response.data)
      
      // Close the modal
      onClose()
    } catch (error: any) {
      console.error('Error registering team:', error)
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError(error.message || 'An error occurred while registering your team')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the modal when clicking on the overlay
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Register Your Team</h2>
          <button className="close-button" onClick={onClose}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Your Wallet Address</label>
            <input
              type="text"
              value={yourWalletAddress}
              onChange={(e) => setYourWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Team Type</label>
            <div className="team-type-selector">
              <button
                type="button"
                className={`team-type-button ${teamType === 'Duo' ? 'active' : ''}`}
                onClick={() => handleTeamTypeChange('Duo')}
              >
                Duo
              </button>
              <button
                type="button"
                className={`team-type-button ${teamType === 'Trio' ? 'active' : ''}`}
                onClick={() => handleTeamTypeChange('Trio')}
              >
                Trio
              </button>
              <button
                type="button"
                className={`team-type-button ${teamType === 'FNF' ? 'active' : ''}`}
                onClick={() => handleTeamTypeChange('FNF')}
              >
                FNF
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>
              {teamType === 'Duo' ? 'Partner\'s Wallet Address' : 
               teamType === 'Trio' ? 'Team Members\' Wallet Addresses' : 
               'FNF Wallet Addresses'}
            </label>
            
            {walletAddresses.map((address, index) => (
              <div key={index} className="wallet-input-group">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => updateWalletAddress(index, e.target.value)}
                  placeholder={`Enter wallet address ${index + 1}`}
                  required
                />
                {teamType === 'FNF' && (
                  <button
                    type="button"
                    className="remove-wallet-button"
                    onClick={() => removeWalletAddress(index)}
                    disabled={walletAddresses.length <= 1}
                  >
                    <MinusIcon className="icon" />
                  </button>
                )}
              </div>
            ))}
            
            {teamType === 'FNF' && (
              <button
                type="button"
                className="add-wallet-button"
                onClick={addWalletAddress}
              >
                <PlusIcon className="icon" />
                Add Another Wallet
              </button>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterTeamModal
