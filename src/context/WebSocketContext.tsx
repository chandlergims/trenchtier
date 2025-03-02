import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    // Only try to connect a limited number of times
    if (retryCount >= MAX_RETRIES) {
      console.log('Max WebSocket connection retries reached, giving up');
      return;
    }

    let socketInstance: Socket | null = null;
    
    try {
      // Create socket connection
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const wsUrl = apiUrl.replace(/^http/, 'ws'); // Convert HTTP to WS
      
      console.log(`API URL: ${apiUrl}`);
      console.log(`WebSocket URL: ${wsUrl}`);
      
      // Configure socket with timeout and reconnection options
      socketInstance = io(apiUrl, { // Still use apiUrl here as Socket.IO handles the protocol conversion
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket'], // Force WebSocket only, no polling fallback
        secure: apiUrl.includes('https'), // Use secure connection for HTTPS URLs
        path: '/socket.io/', // Default Socket.IO path
      });
      
      console.log(`Connecting to WebSocket at: ${apiUrl} (${wsUrl})`);

      // Set up event listeners
      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        setConnectionError(null);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        setConnectionError(`Connection error: ${error.message}`);
        setRetryCount(prev => prev + 1);
      });

      socketInstance.on('error', (error) => {
        console.error('WebSocket error:', error);
        setConnectionError(`Socket error: ${error}`);
      });

      // Save socket instance
      setSocket(socketInstance);
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      setConnectionError(`Initialization error: ${error}`);
      setRetryCount(prev => prev + 1);
    }

    // Clean up on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [retryCount]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </WebSocketContext.Provider>
  );
};
