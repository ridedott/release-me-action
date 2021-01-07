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

  await exec(`npm --prefix ${actionRoot}`, [
    `clean-install "${actionRoot}"`,
    '--only=production',
    '--no-audit',
    '--no-progress',
    '--prefer-offline'
  ]);

  if (additionalPackages.length > 0) {
    await exec(`npm --prefix ${actionRoot}`, [
      `install "${actionRoot}"`,
      ...additionalPackages,
      '--no-audit',
      '--no-progress',
      '--prefer-offline'
    ])
  }
};
