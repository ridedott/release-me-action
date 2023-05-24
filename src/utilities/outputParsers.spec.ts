import * as actionsCore from '@actions/core';
import { Result } from 'semantic-release';

import { reportResults } from './outputParsers';

const setOutputSpy = jest.spyOn(actionsCore, 'setOutput').mockImplementation();

describe('reportResults', (): void => {
  it('sets output based on nextRelease', (): void => {
    expect.assertions(9);

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

    reportResults(input);

    expect(setOutputSpy).toHaveBeenCalledTimes(8);
    expect(setOutputSpy).toHaveBeenCalledWith(
      'version',
      input.nextRelease.version,
    );
    expect(setOutputSpy).toHaveBeenCalledWith('level', input.nextRelease.type);
    expect(setOutputSpy).toHaveBeenCalledWith('released', 'true');

    expect(setOutputSpy).toHaveBeenCalledWith('major', '1');
    expect(setOutputSpy).toHaveBeenCalledWith('minor', '1');
    expect(setOutputSpy).toHaveBeenCalledWith('patch', '1');

    expect(setOutputSpy).toHaveBeenCalledWith('git-head', 'refs/heads/master');
    expect(setOutputSpy).toHaveBeenCalledWith('git-tag', '1.1.1');
  });

  it('sets prerelease and meta outputs if they are included in the version', (): void => {
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
        gitTag: '1.1.1-prerelease+build',
        notes: 'Note',
        type: 'patch',
        version: '1.1.1-prerelease+build',
      },
      releases: [],
    };

    reportResults(input);

    expect(setOutputSpy).toHaveBeenCalledTimes(10);
    expect(setOutputSpy).toHaveBeenCalledWith('pre-release', 'prerelease');
    expect(setOutputSpy).toHaveBeenCalledWith('build', 'build');
  });

  it('throws an error if there is no released version', (): void => {
    expect.assertions(2);

    reportResults(false);

    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(setOutputSpy).toHaveBeenCalledWith('released', 'false');
  });
});
