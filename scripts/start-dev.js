import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🚀 Starting development environment...\n');

// Start backend server
console.log('📡 Starting backend server on http://localhost:5174...');
const backend = spawn('node', ['server/app.js'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

// Wait a bit before starting frontend
setTimeout(() => {
  console.log('🎨 Starting frontend development server on http://localhost:5173...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend server error:', err);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('❌ Backend server error:', err);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  process.exit(0);
});

console.log('\n📋 Development servers starting...');
console.log('   🎨 Frontend: http://localhost:5173');
console.log('   📡 Backend:  http://localhost:5174');
console.log('   📊 API:      http://localhost:5174/api/data');
console.log('\n💡 Press Ctrl+C to stop all servers');