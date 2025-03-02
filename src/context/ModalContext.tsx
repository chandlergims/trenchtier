import React, { createContext, useContext, useState, ReactNode } from 'react'
import TeamDetailsModal from '../components/TeamDetailsModal'

interface ModalContextType {
  openTeamDetailsModal: (teamId: string) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isTeamDetailsModalOpen, setIsTeamDetailsModalOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const openTeamDetailsModal = (teamId: string) => {
    setSelectedTeamId(teamId)
    setIsTeamDetailsModalOpen(true)
  }

  const closeModal = () => {
    setIsTeamDetailsModalOpen(false)
  }

  return (
    <ModalContext.Provider
      value={{
        openTeamDetailsModal,
        closeModal
      }}
    >
      {children}
      
      {selectedTeamId && (
        <TeamDetailsModal
          isOpen={isTeamDetailsModalOpen}
          onClose={closeModal}
          teamId={selectedTeamId}
        />
      )}
    </ModalContext.Provider>
  )
}
