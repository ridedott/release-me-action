import { setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  Version = 'version',
  Type = 'type',
  Status = 'status',
}

enum OutputStatuses {
  Released = 'released',
  Noop = 'noop',
}

export const reportResults = (result: Result): void => {
  if (result === false) {
    setOutput(OutputParameters.Status, OutputStatuses.Noop);

    return;
  }

  const { nextRelease } = result;

  setOutput(OutputParameters.Status, 'true');
  setOutput(OutputParameters.Version, nextRelease.version);
  setOutput(OutputParameters.Type, nextRelease.type);
};
