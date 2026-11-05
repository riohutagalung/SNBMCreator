import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Explicit Node.js entry point for platforms that require an entry file.
// Keep the existing React Router SSR server and its static asset handling.
const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const serverBuild = path.join(repoRoot, 'dist', 'apps', 'web', 'server', 'index.js');
const candidates = [
  path.join(repoRoot, 'node_modules', '.bin', 'react-router-serve'),
  path.join(repoRoot, 'apps', 'web', 'node_modules', '.bin', 'react-router-serve'),
];
const cli = candidates.find(existsSync);

if (!existsSync(serverBuild)) {
  console.error(`SNBM Creator: server build not found at ${serverBuild}. Run npm run build first.`);
  process.exit(1);
}
if (!cli) {
  console.error('SNBM Creator: react-router-serve executable not installed. Run npm install first.');
  process.exit(1);
}

const app = spawn(cli, [serverBuild], {
  cwd: repoRoot,
  env: { ...process.env, PORT: process.env.PORT || '3000' },
  stdio: 'inherit',
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => app.kill(signal));
}
app.on('error', error => {
  console.error('SNBM Creator: unable to start SSR server:', error);
  process.exitCode = 1;
});
app.on('exit', (code, signal) => {
  process.exit(code ?? (signal ? 0 : 1));
});
