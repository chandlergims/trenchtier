import express, { Request, Response } from 'express';
import Team, { ITeam } from '../models/Team';
import { io } from '../server';

const router = express.Router();

// GET all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET recent teams (for the feed)
router.get('/recent', async (req: Request, res: Response) => {
  console.log('GET /api/teams/recent request received');
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    console.log(`Fetching ${limit} recent teams...`);
    
    // Log the MongoDB query we're about to execute
    console.log('MongoDB query:', {
      collection: 'teams',
      operation: 'find',
      sort: { createdAt: -1 },
      limit: limit,
      select: 'teamName teamType createdAt'
    });
    
    const teams = await Team.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('teamName teamType createdAt');
    
    console.log(`Found ${teams.length} recent teams`);
    if (teams.length > 0) {
      console.log('First team:', {
        id: teams[0]._id,
        name: teams[0].teamName,
        type: teams[0].teamType,
        createdAt: teams[0].createdAt
      });
    } else {
      console.log('No teams found in the database');
    }
    
    // Add CORS headers explicitly
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching recent teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET count of all teams
router.get('/count', async (req: Request, res: Response) => {
  try {
    const count = await Team.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single team by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST register a new team
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { teamName, teamType, ownerWalletAddress, memberWalletAddresses } = req.body;
    
    // Validate required fields
    if (!teamName || !teamType || !ownerWalletAddress || !memberWalletAddresses) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate team type
    if (!['Duo', 'Trio', 'FNF'].includes(teamType)) {
      return res.status(400).json({ message: 'Invalid team type' });
    }
    
    // Validate number of members based on team type
    if (teamType === 'Duo' && memberWalletAddresses.length !== 1) {
      return res.status(400).json({ message: 'Duo teams must have exactly 1 member' });
    }
    
    if (teamType === 'Trio' && memberWalletAddresses.length !== 2) {
      return res.status(400).json({ message: 'Trio teams must have exactly 2 members' });
    }
    
    if (teamType === 'FNF' && memberWalletAddresses.length < 1) {
      return res.status(400).json({ message: 'FNF teams must have at least 1 member' });
    }
    
    // Check for empty wallet addresses
    if (memberWalletAddresses.some((address: string) => !address.trim())) {
      return res.status(400).json({ message: 'All wallet addresses must be non-empty' });
    }
    
    // Check for duplicate wallet addresses
    if (memberWalletAddresses.includes(ownerWalletAddress)) {
      return res.status(400).json({ message: 'Team members cannot include your own wallet address' });
    }
    
    // Check for duplicate addresses within the member list
    const uniqueAddresses = new Set(memberWalletAddresses);
    if (uniqueAddresses.size !== memberWalletAddresses.length) {
      return res.status(400).json({ message: 'Each team member must have a unique wallet address' });
    }
    
    // Create new team
    const newTeam = new Team({
      teamName,
      teamType,
      ownerWalletAddress,
      memberWalletAddresses
    });
    
    const savedTeam = await newTeam.save();
    
    // Socket.io has been removed, so no event emission
    // Just log the new team creation
    console.log('New team created:', {
      _id: savedTeam._id,
      teamName: savedTeam.teamName,
      teamType: savedTeam.teamType,
      createdAt: savedTeam.createdAt
    });
    
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error registering team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
