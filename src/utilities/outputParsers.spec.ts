import { jest } from '@jest/globals';
import type { Result } from 'semantic-release';

const setOutputSpy = jest.fn() as unknown as jest.SpiedFunction<
  (_: never, packages: string[]) => unknown
>;

jest.unstable_mockModule('@actions/core', (): unknown => ({
  setOutput: setOutputSpy,
}));

describe('reportResults', (): void => {
  it('sets output based on nextRelease', async (): Promise<void> => {
    expect.assertions(9);

    const { reportResults } = await import('./outputParsers.js');

    const input: Result = {
      commits: [],
      lastRelease: {
        channels: [],
        gitHead: 'ca39a3ee5e6b4b0d3255bfef95601890afd80708',
        gitTag: 'v1.1.0',
        name: 'v1.1.0',
        version: '1.1.0',
      },
      nextRelease: {
        channel: 'latest',
        gitHead: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        gitTag: 'v1.1.1',
        name: 'v1.1.1',
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

    expect(setOutputSpy).toHaveBeenCalledWith(
      'git-head',
      'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    );
    expect(setOutputSpy).toHaveBeenCalledWith('git-tag', 'v1.1.1');
  });

  it('sets prerelease and meta outputs if they are included in the version', async (): Promise<void> => {
    expect.assertions(3);

    const { reportResults } = await import('./outputParsers.js');

    const input: Result = {
      commits: [],
      lastRelease: {
        channels: [],
        gitHead: 'refs/heads/master',
        gitTag: '1.1.0',
        name: '1.1.0',
        version: '1.1.0',
      },
      nextRelease: {
        channel: 'latest',
        gitHead: 'refs/heads/master',
        gitTag: '1.1.1-prerelease+build',
        name: '1.1.1-prerelease+build',
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

  it('throws an error if there is no released version', async (): Promise<void> => {
    expect.assertions(2);

    const { reportResults } = await import('./outputParsers.js');

    reportResults(false);

    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(setOutputSpy).toHaveBeenCalledWith('released', 'false');
  });
});
