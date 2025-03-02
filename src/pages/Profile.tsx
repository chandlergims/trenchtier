import { useState, useRef, useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useToast } from '../context/ToastContext'
import '../styles/Profile.css'

interface ProfileData {
  profileImage: string | null;
  twitter: string;
  telegram: string;
}

function Profile() {
  const { showToast } = useToast()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [isSaving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const data: ProfileData = JSON.parse(savedProfile)
      setProfileImage(data.profileImage)
      setTwitter(data.twitter)
      setTelegram(data.telegram)
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const profileData: ProfileData = {
        profileImage,
        twitter,
        telegram
      }
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      showToast('Profile updated successfully', 'success')
    } catch (error) {
      showToast('Failed to save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUploadClick = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') {
      return
    }
    fileInputRef.current?.click()
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-card">
          <h2 className="profile-title">Settings</h2>
          
          <div className="profile-section">
            <div 
              className="profile-image-upload" 
              onClick={handleImageUploadClick}
              onKeyDown={handleImageUploadClick}
              role="button"
              tabIndex={0}
              aria-label="Upload profile image"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-image" />
              ) : (
                <UserCircleIcon className="profile-icon" />
              )}
              <div className="upload-overlay">
                <span>Change Photo</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="profile-section">
            <div className="input-group">
              <label htmlFor="twitter">Twitter</label>
              <div className="input-with-icon">
                <i className="bi bi-twitter-x input-icon"></i>
                <input
                  type="text"
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@username"
                  className="profile-input with-icon"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="telegram">Telegram</label>
              <div className="input-with-icon">
                <i className="bi bi-telegram input-icon"></i>
                <input
                  type="text"
                  id="telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className="profile-input with-icon"
                />
              </div>
            </div>
          </div>

          <button 
            className={`save-button ${isSaving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
            aria-label="Save profile changes"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
