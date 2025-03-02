import React, { createContext, useContext, ReactNode } from 'react';

// Define a dummy socket type that matches the Socket interface
interface DummySocket {
  // Add any methods that might be used in the app
  on: (event: string, callback: (...args: any[]) => void) => DummySocket;
  off: (event: string) => DummySocket;
  emit: (event: string, ...args: any[]) => boolean;
  disconnect: () => void;
}

interface WebSocketContextType {
  socket: DummySocket | null;
  isConnected: boolean;
  connectionError: string | null;
}

// Create a dummy socket object
const dummySocket: DummySocket = {
  on: () => dummySocket,
  off: () => dummySocket,
  emit: () => false,
  disconnect: () => {}
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

// This provider is now just a dummy that doesn't actually connect to WebSockets
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Just return the context with dummy values
  return (
    <WebSocketContext.Provider value={{ 
      socket: null, 
      isConnected: false, 
      connectionError: null 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
