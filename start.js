const { spawn, exec } = require('child_process');
const path = require('path');
require('dotenv').config();

if (process.env.RENDER === 'true' || process.env.NODE_ENV === 'production') {
  console.log('🚀 Production/Render environment detected. Starting server directly...');
  // In production/Render, start the server directly without opening a browser or using nodemon
  require('./server.js');
} else {
  const PORT = process.env.PORT || 5000;
  const url = `http://localhost:${PORT}`;

  console.log('🔄 Starting the backend server...');

  // Start the backend server using nodemon (defined in package.json)
  const server = spawn('npm', ['run', 'server'], {
    stdio: 'inherit',
    shell: true
  });

  // Automatically open the index.html via localhost when server is ready
  setTimeout(() => {
    console.log(`🌐 Opening browser to ${url}...`);
    
    let command;
    if (process.platform === 'win32') {
      command = `start "" "${url}"`;
    } else if (process.platform === 'darwin') {
      command = `open "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }

    exec(command, (error) => {
      if (error) {
        console.error(`❌ Failed to open browser: ${error.message}`);
      }
    });
  }, 1500);

  // Handle exit of the main process to ensure the server child process is cleaned up
  process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit();
  });

  process.on('SIGTERM', () => {
    server.kill('SIGTERM');
    process.exit();
  });
}
