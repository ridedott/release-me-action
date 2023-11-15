import { jest } from '@jest/globals';
import type { Result } from 'semantic-release';

const setFailedSpy = jest.fn();
jest.unstable_mockModule('@actions/core', (): unknown => ({
  setFailed: setFailedSpy,
}));

const releaseSpy = jest.fn() as unknown as jest.SpiedFunction<
  () => Promise<Result>
>;
jest.unstable_mockModule('./release.js', (): unknown => ({
  release: releaseSpy,
}));

const reportResultsSpy = jest.fn();
jest.unstable_mockModule('./utilities/outputParsers.js', (): unknown => ({
  reportResults: reportResultsSpy,
}));

beforeEach((): void => {
  jest.resetModules();
});

describe('release me action main', (): void => {
  it('runs the release function with failure and handles errors properly', async (): Promise<void> => {
    expect.assertions(2);

    releaseSpy.mockRejectedValueOnce(new Error('test error'));
    setFailedSpy.mockImplementationOnce((): void => undefined);

    await import('./index.js');

    expect(reportResultsSpy).toHaveBeenCalledTimes(0);
    expect(setFailedSpy).toHaveBeenCalledWith('"test error"');
  });

  it('runs the release function successfully and sets the output', async (): Promise<void> => {
    expect.assertions(2);

    const result: Result = {
      commits: [],
      lastRelease: {
        channels: [],
        gitHead: 'test',
        gitTag: 'v1.0.0',
        name: 'v1.0.0',
        version: '1.0.0',
      },
      nextRelease: {
        channel: 'stable',
        gitHead: 'test',
        gitTag: 'v1.1.0',
        name: 'v1.1.0',
        type: 'minor',
        version: '1.1.0',
      },
      releases: [],
    };

    releaseSpy.mockResolvedValueOnce(result);
    reportResultsSpy.mockImplementationOnce((): void => undefined);
    setFailedSpy.mockImplementationOnce((): void => undefined);

    await import('./index.js');

    expect(setFailedSpy).toHaveBeenCalledTimes(0);
    expect(reportResultsSpy).toHaveBeenCalledWith(result);
  });
});
