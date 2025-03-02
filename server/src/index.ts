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
  origin: process.env.NODE_ENV === 'production'
    ? ['https://trenchcomp.vercel.app', 'https://trenchcomp.railway.app']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

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
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://trenchcomp.vercel.app', 'https://trenchcomp.railway.app'] // Production origins
      : '*', // Allow all origins in development
    methods: ['GET', 'POST']
  }
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
});
