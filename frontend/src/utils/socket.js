import { io } from 'socket.io-client';

// Initialize socket connection
let socket;

/**
 * Initialize socket connection
 * @returns {object} - Socket.io client instance
 */
export const initSocket = () => {
  if (!socket) {
    // Connect to the server's socket.io instance
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:5000';
      
    console.log('Initializing socket connection to:', socketUrl);
    
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true
    });

    console.log('Socket initialized');
    
    // Setup listeners for connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}`);
    });
    
    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });
  }
  
  return socket;
};

/**
 * Get the current socket instance
 * @returns {object} - Socket.io client instance
 */
export const getSocket = () => {
  if (!socket || !socket.connected) {
    return initSocket();
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected and reset');
  }
}; 