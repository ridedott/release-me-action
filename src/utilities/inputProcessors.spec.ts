import { jest } from '@jest/globals';

const getInputSpy = jest.fn() as unknown as jest.SpiedFunction<
  (_: never, packages: string[]) => unknown
>;

jest.unstable_mockModule('@actions/core', (): unknown => ({
  getInput: getInputSpy,
}));

describe('processInputNodeModule', (): void => {
  it("reurns true when the value of the npm-package input is set to 'true'", async (): Promise<void> => {
    expect.assertions(1);

    const { processInputNodeModule } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue('true');

    const result = processInputNodeModule();

    expect(result).toBe(true);
  });
});

describe('processInputDisableGenerateChangelog', (): void => {
  it("returns true when the value of the disable-generate-changelog input is set to 'true'", async (): Promise<void> => {
    expect.assertions(1);

    const { processInputDisableChangelog } = await import(
      './inputProcessors.js'
    );

    getInputSpy.mockReturnValue('true');

    const result = processInputDisableChangelog();

    expect(result).toBe(true);
  });
});

describe('processInputDryRun', (): void => {
  it("returns true when the value of the dry-run input is set to 'true'", async (): Promise<void> => {
    expect.assertions(1);

    const { processInputDryRun } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue('true');

    const result = processInputDryRun();

    expect(result).toBe(true);
  });
});

describe('processInputReleaseBranches', (): void => {
  it('throws an error if the input parameter value is set to an invalid JSON string', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseBranches } = await import(
      './inputProcessors.js'
    );

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
    async ({ value }: { value: string }): Promise<void> => {
      expect.assertions(1);

      const { processInputReleaseBranches } = await import(
        './inputProcessors.js'
      );

      getInputSpy.mockReturnValue(value);

      try {
        processInputReleaseBranches();
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
      }
    },
  );

  it("returns undefined if the input parameter value is set to an empty string''", async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseBranches } = await import(
      './inputProcessors.js'
    );

    getInputSpy.mockReturnValue('');

    const result = processInputReleaseBranches();

    expect(result).toBeUndefined();
  });

  it('returns a valid branches configuration array passed as json-string', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseBranches } = await import(
      './inputProcessors.js'
    );
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
  it('throws an error if the input parameter value is set to an invalid JSON string', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValueOnce('test').mockReturnValueOnce('');

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
    async ({ value }: { value: string }): Promise<void> => {
      expect.assertions(1);

      const { processInputReleaseRules } = await import('./inputProcessors.js');

      getInputSpy.mockReturnValueOnce(value).mockReturnValueOnce('');

      /* eslint-disable-next-line jest/require-to-throw-message */
      expect(processInputReleaseRules).toThrow();
    },
  );

  it("returns the default release rules if the input parameter value is set to an empty string''", async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValueOnce('').mockReturnValueOnce('');

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

  it('returns a valid branches configuration array passed as json-string', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy
      .mockReturnValueOnce(
        JSON.stringify([
          { release: 'patch', type: 'build' },
          { release: 'patch', type: 'chore(deps)' },
          { release: 'patch', type: 'chore(deps-dev)' },
        ]),
      )
      .mockReturnValueOnce('');

    const result = processInputReleaseRules();

    expect(result).toStrictEqual([
      { release: 'patch', type: 'build' },
      { release: 'patch', type: 'chore(deps)' },
      { release: 'patch', type: 'chore(deps-dev)' },
    ]);
  });
});

describe('processInputReleaseRulesAppend', (): void => {
  it('throws an error if the release-rules-append input parameter value is set to an invalid JSON string', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValueOnce('').mockReturnValueOnce('test');

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
      value: '[{"release": 2}]',
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
    'throws an error if the release-rules-append input parameter is set to an invalid value %j',
    async ({ value }: { value: string }): Promise<void> => {
      expect.assertions(1);

      const { processInputReleaseRules } = await import('./inputProcessors.js');

      getInputSpy.mockReturnValueOnce('').mockReturnValueOnce(value);

      /* eslint-disable-next-line jest/require-to-throw-message */
      expect(processInputReleaseRules).toThrow();
    },
  );

  it('throws and error when both release-rules and release-rules-append are defined', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy
      .mockReturnValueOnce(
        JSON.stringify([
          { release: 'patch', type: 'build' },
          { release: 'patch', type: 'chore(deps)' },
        ]),
      )
      .mockReturnValueOnce(
        JSON.stringify([{ release: 'patch', type: 'chore(deps-dev)' }]),
      );

    expect(processInputReleaseRules).toThrow(
      'Invalid input release-rules-append and release rules cannot both be used.',
    );
  });

  it('returns default release rules with append rules added to the end', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseRules } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValueOnce('').mockReturnValueOnce(
      JSON.stringify([
        {
          release: 'patch',
          scope: 'deps-dev',
          subject: 'bump typescript*',
          type: 'chore',
        },
        { release: false, scope: 'deps-dev', type: 'chore' },
      ]),
    );

    const result = processInputReleaseRules();

    expect(result).toStrictEqual([
      { release: 'patch', type: 'build' },
      { release: 'patch', type: 'chore' },
      { release: 'patch', type: 'ci' },
      { release: 'patch', type: 'docs' },
      { release: 'patch', type: 'improvement' },
      { release: 'patch', type: 'refactor' },
      { release: false, subject: '*\\[skip release\\]*' },
      {
        release: 'patch',
        scope: 'deps-dev',
        subject: 'bump typescript*',
        type: 'chore',
      },
      { release: false, scope: 'deps-dev', type: 'chore' },
    ]);
  });
});

describe('processInputCommitAssets', (): void => {
  it('returns an array of valid paths relative to the project root', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputCommitAssets } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue(`
    ./src
    `);

    const result = processInputCommitAssets();

    expect(result).toStrictEqual(['./src']);
  });
});

describe('processInputReleaseAssets', (): void => {
  it('returns an array of valid paths relative to the project root', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputReleaseAssets } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue(`
    ./src
    `);

    const result = processInputReleaseAssets();

    expect(result).toStrictEqual(['./src']);
  });
});

describe('processInputConfigFile', (): void => {
  it('returns a valid path relative to the project root', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputConfigFile } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue('./src.yaml');

    const result = processInputConfigFile();

    expect(result).toBe('./src.yaml');
  });

  it('throws if the provided path is not a YAML file', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputConfigFile } = await import('./inputProcessors.js');

    getInputSpy.mockReturnValue('./src.json');

    try {
      processInputConfigFile();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('processInputAdditionalPlugins', (): void => {
  it('returns an object in package.json format', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputAdditionalPlugins } = await import(
      './inputProcessors.js'
    );

    getInputSpy.mockReturnValue(
      '{"@google/semantic-release-replace-plugin":"^4.0.2"}',
    );

    const result = processInputAdditionalPlugins();

    expect(result).toStrictEqual({
      '@google/semantic-release-replace-plugin': '^4.0.2',
    });
  });

  it('throws if the input is not valid JSON', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputAdditionalPlugins } = await import(
      './inputProcessors.js'
    );

    getInputSpy.mockReturnValue('foo');

    try {
      processInputAdditionalPlugins();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('throws if the object is not in package.json format', async (): Promise<void> => {
    expect.assertions(1);

    const { processInputAdditionalPlugins } = await import(
      './inputProcessors.js'
    );

    getInputSpy.mockReturnValue('{"foo":1}');

    try {
      processInputAdditionalPlugins();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
