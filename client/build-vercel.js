const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Lyzr Support App for Vercel...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });

  // Build the project
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
