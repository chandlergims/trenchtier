import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

// Create a dummy Team model for the routes
const TeamSchema = new mongoose.Schema({
  teamName: String,
  teamType: String,
  ownerWalletAddress: String,
  memberWalletAddresses: [String],
  createdAt: { type: Date, default: Date.now }
});

// Register the Team model if it doesn't exist
mongoose.models = {};
mongoose.model('Team', TeamSchema);

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Create a simple router for team routes
const teamRoutes = express.Router();

// GET all teams
teamRoutes.get('/', (req, res) => {
  mongoose.model('Team').find().sort({ createdAt: -1 })
    .then(teams => {
      res.status(200).json(teams);
    })
    .catch(error => {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// GET recent teams (for the feed)
teamRoutes.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  console.log(`Fetching ${limit} recent teams...`);
  
  mongoose.model('Team').find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('teamName teamType createdAt')
    .then(teams => {
      console.log(`Found ${teams.length} recent teams`);
      res.status(200).json(teams);
    })
    .catch(error => {
      console.error('Error fetching recent teams:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// GET count of all teams
teamRoutes.get('/count', (req, res) => {
  mongoose.model('Team').countDocuments()
    .then(count => {
      res.status(200).json({ count });
    })
    .catch(error => {
      console.error('Error counting teams:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// GET a single team by ID
teamRoutes.get('/:id', (req, res) => {
  mongoose.model('Team').findById(req.params.id)
    .then(team => {
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.status(200).json(team);
    })
    .catch(error => {
      console.error('Error fetching team:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// POST register a new team
teamRoutes.post('/register', (req, res) => {
  const { teamName, teamType, ownerWalletAddress, memberWalletAddresses } = req.body;
  
  // Validate required fields
  if (!teamName || !teamType || !ownerWalletAddress || !memberWalletAddresses) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Create new team
  const Team = mongoose.model('Team');
  const newTeam = new Team({
    teamName,
    teamType,
    ownerWalletAddress,
    memberWalletAddresses
  });
  
  newTeam.save()
    .then(savedTeam => {
      console.log('New team created:', {
        _id: savedTeam._id,
        teamName: savedTeam.teamName,
        teamType: savedTeam.teamType,
        createdAt: savedTeam.createdAt
      });
      res.status(201).json(savedTeam);
    })
    .catch(error => {
      console.error('Error registering team:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

// API routes
app.use('/api/teams', teamRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from the dist directory if it exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('Serving static files from dist directory');
  app.use(express.static(distPath));

  // For any request that doesn't match a static file or API route, serve index.html
  app.get('*', (req, res) => {
    console.log(`Serving index.html for: ${req.url}`);
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built. Please run npm run build first.');
    }
  });
} else {
  console.log('Dist directory not found. Running in API-only mode.');
  // Fallback route for when dist directory doesn't exist
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      // Let API routes be handled by their handlers
      next();
    } else {
      res.status(200).send('Server running in API-only mode. Frontend not built.');
    }
  });
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (mongoURI) {
  console.log('Attempting to connect to MongoDB...');
  console.log('MongoDB URI defined:', !!mongoURI);
  console.log('MongoDB URI prefix:', mongoURI.substring(0, 20) + '...');
  
  mongoose.set('debug', true);
  
  mongoose.connect(mongoURI)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      
      // Test the connection by counting teams
      return mongoose.model('Team').countDocuments();
    })
    .then((count) => {
      console.log(`Database contains ${count} teams`);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.error('Connection string (partial):', mongoURI.substring(0, 20) + '...');
      // Don't exit process on connection error in production
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    });
} else {
  console.warn('MongoDB URI not defined, skipping database connection');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create a dummy io object for compatibility with existing code
global.io = {
  emit: () => {} // No-op function
};
