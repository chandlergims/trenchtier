import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import teamRoutes from './routes/teamRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Ensure Express doesn't intercept WebSocket requests
app.use((req, res, next) => {
  if (req.url.includes('/socket.io/')) {
    console.log('WebSocket request detected:', req.url);
    return next();
  }
  res.header('X-Powered-By', 'Express');
  next();
});

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MongoDB URI is not defined');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/teams', teamRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create HTTP server and Socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"], // Force WebSocket only, no polling fallback
  pingTimeout: 60000, // Increase ping timeout to 60 seconds
  pingInterval: 25000, // Increase ping interval to 25 seconds
  allowEIO3: true // Allow Engine.IO 3 compatibility
});

// Track connected users
let connectedUsers = 0;

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Increment connected users count
  connectedUsers++;
  
  // Emit updated count to all clients
  io.emit('users:count', { connectedUsers });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Decrement connected users count
    connectedUsers--;
    
    // Emit updated count to all clients
    io.emit('users:count', { connectedUsers });
  });
});

// Export io instance to use in other files
export { io };

// Start server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`WebSocket server available at ${process.env.NODE_ENV === 'production' ? 'wss://' : 'ws://'}your-domain:${port}`);
});
