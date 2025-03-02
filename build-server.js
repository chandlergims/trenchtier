import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const serverSrcDir = path.join(__dirname, 'server', 'src');
const routesDir = path.join(serverSrcDir, 'routes');
const modelsDir = path.join(serverSrcDir, 'models');

// Ensure directories exist
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Convert TypeScript files to JavaScript
const convertTsToJs = (tsFilePath, jsFilePath) => {
  const tsContent = fs.readFileSync(tsFilePath, 'utf8');
  
  // Simple conversion (this is a very basic conversion and won't handle all TS features)
  let jsContent = tsContent
    // Remove type annotations
    .replace(/: [A-Za-z<>[\]|]+/g, '')
    // Remove interface definitions
    .replace(/interface [A-Za-z]+ \{[\s\S]*?\}/g, '')
    // Remove import type statements
    .replace(/import type.*?;/g, '')
    // Convert export default to module.exports
    .replace(/export default/g, 'export default')
    // Remove TypeScript specific keywords
    .replace(/readonly /g, '')
    .replace(/<[^>]+>/g, '');
  
  // Write the JavaScript file
  fs.writeFileSync(jsFilePath, jsContent);
  console.log(`Converted ${tsFilePath} to ${jsFilePath}`);
};

// Convert teamRoutes.ts to teamRoutes.js
const teamRoutesTs = path.join(routesDir, 'teamRoutes.ts');
const teamRoutesJs = path.join(routesDir, 'teamRoutes.js');
if (fs.existsSync(teamRoutesTs)) {
  convertTsToJs(teamRoutesTs, teamRoutesJs);
}

// Convert Team.ts to Team.js
const teamModelTs = path.join(modelsDir, 'Team.ts');
const teamModelJs = path.join(modelsDir, 'Team.js');
if (fs.existsSync(teamModelTs)) {
  convertTsToJs(teamModelTs, teamModelJs);
}

console.log('Server build completed');
