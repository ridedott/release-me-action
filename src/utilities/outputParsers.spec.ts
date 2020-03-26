import * as actionsCore from '@actions/core';
import { Result } from 'semantic-release';

import { reportResults } from './outputParsers';

const setOutputSpy = jest.spyOn(actionsCore, 'setOutput').mockImplementation();

describe('reportResults', (): void => {
  it('sets output based on nextRelease', (): void => {
    expect.assertions(3);

    const input: Result = {
      commits: [],
      lastRelease: {
        gitHead: 'refs/heads/master',
        gitTag: '1.1.0',
        version: '1.1.0',
      },
      nextRelease: {
        gitHead: 'refs/heads/master',
        gitTag: '1.1.1',
        notes: 'Note',
        type: 'patch',
        version: '1.1.1',
      },
      releases: [],
    };

    const result = reportResults(input);

    expect(result).toBeUndefined();
    expect(setOutputSpy).toHaveBeenCalledWith(
      'version',
      input.nextRelease.version,
    );
    expect(setOutputSpy).toHaveBeenCalledWith('type', input.nextRelease.type);
  });

  it('throws an error if there is no released version', (): void => {
    expect.assertions(2);

    const input: Result = false;

    expect((): void => reportResults(input)).toThrowErrorMatchingInlineSnapshot(
      `"No new version has been released."`,
    );
    expect(setOutputSpy).toHaveBeenCalledTimes(0);
  });
});
