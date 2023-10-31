import { exec } from '@actions/exec';
import { resolve as pathResolve } from 'path';
import * as url from 'url';

import { AdditionalPluginsSpec } from './inputProcessors.js';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const installDependencies = async (
  additionalPlugins?: AdditionalPluginsSpec,
): Promise<void> => {
  const actionRoot = pathResolve(__dirname, '../../');

  const additionalPackages = Object.entries(additionalPlugins ?? []).map(
    ([plugin, version]: [string, string]): string => `${plugin}@${version}`,
  );

  await exec(pathResolve(actionRoot, 'scripts', 'install-dependencies.sh'), [
    actionRoot,
    ...additionalPackages,
  ]);
};
