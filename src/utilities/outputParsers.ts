import { setFailed, setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  ReleasedVersion = 'version',
  ReleasedType = 'type',
}

export const reportResults = (result: Result): void => {
  if (result === false) {
    setFailed('Repository changes do not meet criteria to trigger a release.');

    return;
  }

  const { nextRelease } = result;

  setOutput(OutputParameters.ReleasedVersion, nextRelease.version);
  setOutput(OutputParameters.ReleasedType, nextRelease.type);
};
