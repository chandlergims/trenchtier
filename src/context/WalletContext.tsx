import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from './ToastContext'

interface WalletContextType {
  isConnected: boolean
  walletAddress: string
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    const initializeWallet = async () => {
      // @ts-ignore
      const { solana } = window
      
      if (solana?.isPhantom) {
        try {
          // Check if wallet is already connected
          if (solana.isConnected && solana.publicKey) {
            const publicKey = solana.publicKey.toString()
            setWalletAddress(publicKey)
            setIsConnected(true)
            localStorage.setItem('walletAddress', publicKey)
          } else {
            // Try to reconnect if we have a saved address
            const savedWalletAddress = localStorage.getItem('walletAddress')
            if (savedWalletAddress) {
              try {
                const response = await solana.connect({ onlyIfTrusted: true })
                const publicKey = response.publicKey.toString()
                setWalletAddress(publicKey)
                setIsConnected(true)
                localStorage.setItem('walletAddress', publicKey)
              } catch {
                // If auto-connect fails, clear saved address
                localStorage.removeItem('walletAddress')
              }
            }
          }
        } catch (error) {
          console.error('Error initializing wallet:', error)
          localStorage.removeItem('walletAddress')
        }
      }
    }

    // Initialize wallet on mount
    initializeWallet()

    // @ts-ignore
    const { solana } = window
    
    if (solana?.isPhantom) {
      const handleConnect = () => {
        const publicKey = solana.publicKey.toString()
        setWalletAddress(publicKey)
        setIsConnected(true)
        localStorage.setItem('walletAddress', publicKey)
      }

      const handleDisconnect = () => {
        setWalletAddress('')
        setIsConnected(false)
        localStorage.removeItem('walletAddress')
      }

      solana.on('connect', handleConnect)
      solana.on('disconnect', handleDisconnect)
      solana.on('accountChanged', handleConnect)

      return () => {
        solana.removeListener('connect', handleConnect)
        solana.removeListener('disconnect', handleDisconnect)
        solana.removeListener('accountChanged', handleConnect)
      }
    }
  }, [])

  const connect = async () => {
    try {
      // @ts-ignore
      const { solana } = window

      if (!solana?.isPhantom) {
        showToast('Please install Phantom wallet', 'info')
        return
      }

      const response = await solana.connect()
      const address = response.publicKey.toString()
      
      localStorage.setItem('walletAddress', address)
      setWalletAddress(address)
      setIsConnected(true)
      showToast('Wallet connected successfully', 'success')
    } catch (error) {
      console.error(error)
      showToast('Error connecting wallet', 'error')
    }
  }

  const disconnect = () => {
    // @ts-ignore
    const { solana } = window
    if (solana?.isPhantom) {
      solana.disconnect()
    }
    localStorage.removeItem('walletAddress')
    setWalletAddress('')
    setIsConnected(false)
    showToast('Wallet disconnected', 'info')
  }

  return (
    <WalletContext.Provider value={{ isConnected, walletAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
