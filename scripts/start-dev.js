import { spawn } from 'child_process';

const child = spawn('npx', ['vercel', 'dev'], { stdio: 'inherit', shell: true });

child.on('exit', (code) => {
  process.exit(code);
});