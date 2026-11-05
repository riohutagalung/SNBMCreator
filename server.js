import express from 'express';
import { createRequestHandler } from '@react-router/express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Hostinger manages the Node.js process. Start the SSR server directly
// instead of spawning a second process (which can exceed shared-host limits).
const root = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(root, 'dist', 'apps', 'web', 'client');
const serverFile = path.join(root, 'dist', 'apps', 'web', 'server', 'index.js');

if (!existsSync(serverFile)) {
  throw new Error(`SNBM Creator SSR build is missing: ${serverFile}. Run npm run build.`);
}

const app = express();
app.disable('x-powered-by');

// Static assets are produced under the React Router client build directory.
app.use(express.static(clientDir, { maxAge: '1h', index: false }));

// Hostinger's lsnode loader calls require() on this ESM entry. Avoid any
// top-level await so Node 22 can load the entry synchronously; start the
// async import only after module initialization has completed.
async function start() {
  const serverBuild = await import(pathToFileURL(serverFile).href);
  app.use(createRequestHandler({ build: serverBuild, mode: process.env.NODE_ENV || 'production' }));

  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`SNBM Creator SSR listening on 0.0.0.0:${port}`);
  });
  server.on('error', (error) => {
    console.error('SNBM Creator could not start the SSR server:', error);
    process.exitCode = 1;
  });
}

void start().catch((error) => {
  console.error('SNBM Creator failed to initialize the SSR server:', error);
  process.exit(1);
});
