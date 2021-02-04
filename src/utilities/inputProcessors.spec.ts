import * as actionsCore from '@actions/core';

import {
  processInputAdditionalPlugins,
  processInputCommitAssets,
  processInputConfigFile,
  processInputDisableChangelog,
  processInputDryRun,
  processInputNodeModule,
  processInputReleaseAssets,
  processInputReleaseBranches,
  processInputReleaseRules,
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

describe('processInputDisableGenerateChangelog', (): void => {
  it("returns true when the value of the disable-generate-changelog input is set to 'true'", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('true');

    const result = processInputDisableChangelog();

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

    expect(processInputReleaseBranches).toThrow(
      'Invalid JSON string for input parameter release-branches.',
    );
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
      value: '[{"name": "test", "prerelease": false}]',
    },
    {
      value: '[{"name": "test", "prerelease": 1}]',
    },
    {
      value: '[{"name": "test", "range": true}]',
    },
  ])(
    'throws an error if the input parameter is set to an invalid value %j',
    ({ value }: { value: string }): void => {
      expect.assertions(1);

      getInputSpy.mockReturnValue(value);

      try {
        processInputReleaseBranches();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
      }
    },
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

describe('processInputReleaseRules', (): void => {
  it('throws an error if the input parameter value is set to an invalid JSON string', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('test');

    expect(processInputReleaseRules).toThrow(
      'Invalid JSON string for input parameter release-rules.',
    );
  });

  it.each([
    {
      value: '[]',
    },
    {
      value: '[{}]',
    },
    {
      value: '[{"release": 1}]',
    },
    {
      value: '[{"release": "test"}]',
    },
    {
      value: '[{"release": "patch", "scope": false}]',
    },
    {
      value: '[{"release": "patch", "subject": false}]',
    },
  ])(
    'throws an error if the input parameter is set to an invalid value %j',
    ({ value }: { value: string }): void => {
      expect.assertions(1);

      getInputSpy.mockReturnValue(value);

      /* eslint-disable-next-line jest/require-to-throw-message */
      expect(processInputReleaseRules).toThrow();
    },
  );

  it("returns the default release rules if the input parameter value is set to an empty string''", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('');

    const result = processInputReleaseRules();

    expect(result).toStrictEqual([
      { release: 'patch', type: 'build' },
      { release: 'patch', type: 'chore' },
      { release: 'patch', type: 'ci' },
      { release: 'patch', type: 'docs' },
      { release: 'patch', type: 'improvement' },
      { release: 'patch', type: 'refactor' },
      { release: false, subject: '*\\[skip release\\]*' },
    ]);
  });

  it('returns a valid branches configuration array passed as json-string', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(
      JSON.stringify([
        { release: 'patch', type: 'build' },
        { release: 'patch', type: 'chore(deps)' },
        { release: 'patch', type: 'chore(deps-dev)' },
      ]),
    );

    const result = processInputReleaseRules();

    expect(result).toStrictEqual([
      { release: 'patch', type: 'build' },
      { release: 'patch', type: 'chore(deps)' },
      { release: 'patch', type: 'chore(deps-dev)' },
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

describe('processInputConfigFile', (): void => {
  it('returns a valid path relative to the project root', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('./src.yaml');

    const result = processInputConfigFile();

    expect(result).toStrictEqual('./src.yaml');
  });

  it('throws if the provided path is not a YAML file', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('./src.json');

    try {
      processInputConfigFile();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('processInputAdditionalPlugins', (): void => {
  it('returns an object in package.json format', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(
      '{"@google/semantic-release-replace-plugin":"^4.0.2"}',
    );

    const result = processInputAdditionalPlugins();

    expect(result).toStrictEqual({
      '@google/semantic-release-replace-plugin': '^4.0.2',
    });
  });

  it('throws if the input is not valid JSON', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('foo');

    try {
      processInputAdditionalPlugins();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('throws if the object is not in package.json format', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('{"foo":1}');

    try {
      processInputAdditionalPlugins();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
