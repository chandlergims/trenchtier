import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Skip API requests - these should be handled by the backend server
app.use('/api', (req, res) => {
  console.log(`API request received: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'API endpoint not found on frontend server' });
});

// For any request that doesn't match a static file or API route, serve index.html
app.get('*', (req, res) => {
  console.log(`Serving index.html for: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Note: API requests should be handled by a separate backend server`);
});
