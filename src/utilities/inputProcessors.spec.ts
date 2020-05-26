import * as actionsCore from '@actions/core';

import {
  processInputCommitAssets,
  processInputDryRun,
  processInputNodeModule,
  processInputReleaseAssets,
  processInputReleaseBranches,
} from './inputProcessors';

const getInputSpy = jest.spyOn(actionsCore, 'getInput').mockImplementation();

describe('processInputNodeModule', (): void => {
  it("returns true when the value of the npm-package input is set to 'true'", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('true');

    const result = processInputNodeModule();

    expect(result).toStrictEqual(true);
  });
});

describe('processInputDryRun', (): void => {
  it("returns true when the value of the dry-run input is set to 'true'", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('true');

    const result = processInputDryRun();

    expect(result).toStrictEqual(true);
  });
});

describe('processInputReleaseBranches', (): void => {
  it('throws an error if the input parameter value is set to an invalid JSON string', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('test');

    expect(processInputReleaseBranches).toThrow('Invalid JSON string for input parameter release-branches.');
  });

  it.each([
    {
      value: '[{}]',
    },
    {
      value: '[{"name": 1}]',
    },
    {
      value: '[{"name": "test", "channel": true}]',
    },
    {
      value: '[{"name": "test", "channel": 1}]',
    },
    {
      value: '[{"name": "test", "prerelease": true}]',
    },
    {
      value: '[{"name": "test", "prerelease": 1}]',
    },
    {
      value: '[{"name": "test", "range": true}]',
    }
  ])(
    'throws an error if the input parameter is set to an invalid value %j',
    (
      {
        value,
      }: {
        value: string,
      }
      ): void => {
      expect.assertions(1);

      getInputSpy.mockReturnValue(value);

      // eslint-disable-next-line jest/require-to-throw-message
      expect(processInputReleaseBranches).toThrow();
    }
  );

  it("returns undefined if the input parameter value is set to an empty string''", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('');

    const result = processInputReleaseBranches();

    expect(result).toBeUndefined();
  });

  it('returns a valid branches configuration array passed as json-string', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(
      JSON.stringify([
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        'next',
        'next-major',
        { name: 'beta', prerelease: 'beta' },
        { name: 'alpha', prerelease: 'alpha' },
      ]),
    );

    const result = processInputReleaseBranches();

    expect(result).toStrictEqual([
      '+([0-9])?(.{+([0-9]),x}).x',
      'master',
      'next',
      'next-major',
      { name: 'beta', prerelease: 'beta' },
      { name: 'alpha', prerelease: 'alpha' },
    ]);
  });
});

describe('processInputCommitAssets', (): void => {
  it('returns an array of valid paths relative to the project root', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(`
    ./src
    `);

    const result = processInputCommitAssets();

    expect(result).toStrictEqual(['./src']);
  });
});

describe('processInputReleaseAssets', (): void => {
  it('returns an array of valid paths relative to the project root', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(`
    ./src
    `);

    const result = processInputReleaseAssets();

    expect(result).toStrictEqual(['./src']);
  });
});
