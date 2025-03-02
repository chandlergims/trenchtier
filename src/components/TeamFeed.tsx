import { useState, useEffect } from 'react'
import axios from 'axios'
import { useModal } from '../context/ModalContext'
import { useWebSocket } from '../context/WebSocketContext'
import '../styles/TeamFeed.css'

interface Team {
  _id: string
  teamName: string
  teamType: 'Duo' | 'Trio' | 'FnF'
  createdAt: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
}

function TeamFeed() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [connectedUsers, setConnectedUsers] = useState<number>(0)
  const [totalTeams, setTotalTeams] = useState<number>(0)
  const { openTeamDetailsModal } = useModal()
  const { socket } = useWebSocket()
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/teams/recent`)
      // Ensure teams is always an array
      setTeams(Array.isArray(response.data) ? response.data : [])
      setError(null)
      
      // Fetch total number of teams
      const countResponse = await axios.get(`${apiUrl}/api/teams/count`)
      setTotalTeams(countResponse.data.count || 0)
    } catch (err) {
      console.error('Error fetching teams:', err)
      setError('Failed to load recent teams')
      setTeams([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTeams()
    
    // Poll for new teams every 30 seconds as a fallback
    const interval = setInterval(() => {
      fetchTeams()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) {
      // If socket is null, we'll rely on polling for updates
      console.log('WebSocket not available, using polling for updates')
      return
    }
    
    try {
      // Listen for new team creation events
      socket.on('team:created', (newTeam: Team) => {
        console.log('New team created:', newTeam)
        
        // Add the new team to the beginning of the list
        setTeams(prevTeams => {
          // Check if the team is already in the list (avoid duplicates)
          const exists = prevTeams.some(team => team._id === newTeam._id)
          if (exists) return prevTeams
          
          // Add the new team to the beginning and limit to 10 teams
          return [newTeam, ...prevTeams].slice(0, 10)
        })
        
        // Increment total teams count
        setTotalTeams(prev => prev + 1)
      })
      
      // Listen for connected users count updates
      socket.on('users:count', (data: { connectedUsers: number }) => {
        console.log('Connected users updated:', data.connectedUsers)
        setConnectedUsers(data.connectedUsers || 0)
      })
      
      // Clean up event listeners on unmount
      return () => {
        socket.off('team:created')
        socket.off('users:count')
      }
    } catch (error) {
      console.error('Error setting up WebSocket listeners:', error)
      // Continue without WebSocket functionality
    }
  }, [socket])
  
  return (
    <div className="team-feed">
      <div className="team-feed-header">
        <h3>New Teams</h3>
        <div className="team-stats">
          <div className="stat-item">
            <div className="online-indicator"></div>
            <span>{connectedUsers} online</span>
          </div>
          <div className="stat-item">
            <span>{totalTeams} teams registered</span>
          </div>
        </div>
      </div>
      <div className="team-list">
        {loading ? (
          <div className="loading-message">Loading teams...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : teams.length === 0 ? (
          <div className="empty-message">No teams registered yet</div>
        ) : (
          teams.map(team => (
            <div 
              key={team._id} 
              className="team-item"
              onClick={() => openTeamDetailsModal(team._id)}
            >
              <div className="team-name">{team.teamName}</div>
              <div className="team-details">
                <span className={`team-type ${team.teamType.toLowerCase()}`}>{team.teamType}</span>
                <span className="team-time">{formatTimeAgo(team.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TeamFeed
