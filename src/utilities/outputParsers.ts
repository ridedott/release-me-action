import { setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  ReleasedVersion = 'released-version',
  ReleasedType = 'released-type',
}

export const reportResults = (result: Result): void => {
  if (result === false) {
    throw new Error('No new version has been released.');
  }

  const { nextRelease } = result;

  setOutput(OutputParameters.ReleasedVersion, nextRelease.version);
  setOutput(OutputParameters.ReleasedType, nextRelease.type);
};
