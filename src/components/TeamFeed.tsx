import { useState, useEffect } from 'react'
import axios from 'axios'
import { useModal } from '../context/ModalContext'
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
  const [totalTeams, setTotalTeams] = useState<number>(0)
  const { openTeamDetailsModal } = useModal()
  
  // Get the API URL from environment variables
  // In development, it's http://localhost:5000
  // In production, it's /api (relative URL)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Determine if we need to append /api to the URL
  // If apiUrl already contains /api (production), don't append it again
  const teamsUrl = apiUrl.includes('/api') ? `${apiUrl}/teams/recent` : `${apiUrl}/api/teams/recent`;
  const countUrl = apiUrl.includes('/api') ? `${apiUrl}/teams/count` : `${apiUrl}/api/teams/count`;
  
  const fetchTeams = async () => {
    console.log(`Fetching teams from: ${teamsUrl}`)
    try {
      const response = await axios.get(teamsUrl)
      console.log('API response:', response)
      
      // Ensure teams is always an array
      const teamsData = Array.isArray(response.data) ? response.data : []
      console.log(`Received ${teamsData.length} teams:`, teamsData)
      
      setTeams(teamsData)
      setError(null)
      
      // Fetch total number of teams
      console.log(`Fetching team count from: ${countUrl}`)
      const countResponse = await axios.get(countUrl)
      console.log('Count response:', countResponse.data)
      
      setTotalTeams(countResponse.data.count || 0)
    } catch (err) {
      console.error('Error fetching teams:', err)
      // Log more details about the error
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers
        })
      }
      
      setError('Failed to load recent teams')
      setTeams([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTeams()
    
    // Poll for new teams every 30 seconds
    const interval = setInterval(() => {
      fetchTeams()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="team-feed">
      <div className="team-feed-header">
        <h3>New Teams</h3>
        <div className="team-stats">
          <div className="stat-item">
            <div className="online-indicator"></div>
            <span>Online</span>
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
