import { exec } from '@actions/exec';
import { resolve as pathResolve } from 'path';

import { AdditionalPluginsSpec } from './inputProcessors';

export const installDependencies = async (
  additionalPlugins?: AdditionalPluginsSpec,
): Promise<void> => {
  const actionRoot = pathResolve(__dirname, '../');

  const additionalPackages = Object.entries(additionalPlugins ?? []).map(
    ([plugin, version]: [string, string]): string => `${plugin}@${version}`,
  );

  await exec(pathResolve(actionRoot, 'scripts', 'install-dependencies.sh'), [
    actionRoot,
    ...additionalPackages,
  ]);
};
