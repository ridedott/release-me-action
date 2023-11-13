import * as url from 'url';
import { execSync } from 'child_process';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const actionRoot = __dirname;

execSync(
  `npm --prefix ${actionRoot} install semantic-release --omit=dev --no-audit --no-progress --prefer-offline`,
  {
    stdio: 'inherit',
    cwd: actionRoot,
    env: {
      ...process.env,
      PWD: actionRoot,
    },
  },
);

await import('./dist/index.js');
