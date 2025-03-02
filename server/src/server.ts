import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import teamRoutes from './routes/teamRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins explicitly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add a pre-flight OPTIONS handler for CORS
app.options('*', cors());

app.use(express.json());

// Log environment variables (without sensitive data)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MongoDB URI defined:', !!process.env.MONGODB_URI);
console.log('MongoDB URI prefix:', process.env.MONGODB_URI?.substring(0, 20) + '...');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MongoDB URI is not defined');
  process.exit(1);
}

// Set mongoose debug mode to log all operations
mongoose.set('debug', true);

console.log('Attempting to connect to MongoDB...');
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    
    // Test the connection by counting teams
    console.log('Testing MongoDB connection by counting teams...');
    return mongoose.model('Team').countDocuments();
  })
  .then((count) => {
    console.log(`Database contains ${count} teams`);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('Connection string (partial):', mongoURI.substring(0, 20) + '...');
    process.exit(1);
  });

// Routes
app.use('/api/teams', teamRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Dummy io object for compatibility with existing code
const io = {
  emit: () => {} // No-op function
};

// Export io instance to use in other files (now just a dummy)
export { io };

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
