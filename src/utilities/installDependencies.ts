import { exec } from '@actions/exec';
import { resolve as pathResolve } from 'path';

export const installDependencies = async (): Promise<void> => {
  const actionRoot = pathResolve(__dirname, '../');

  await exec(pathResolve(actionRoot, 'scripts', 'install-dependencies.sh'), [
    actionRoot,
  ]);
};
