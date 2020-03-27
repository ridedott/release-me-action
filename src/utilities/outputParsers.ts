import { setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  Version = 'version',
  Type = 'type',
  Released = 'released',
}

export const reportResults = (result: Result): void => {
  if (result === false) {
    setOutput(OutputParameters.Released, 'false');

    return;
  }

  const { nextRelease } = result;

  setOutput(OutputParameters.Released, 'true');
  setOutput(OutputParameters.Version, nextRelease.version);
  setOutput(OutputParameters.Type, nextRelease.type);
};
