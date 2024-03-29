import { jest } from '@jest/globals';
import { $ } from 'execa';

import { gitCommits, gitPush, gitRepo } from './utilities/git.js';

jest.setTimeout(10_000);

const execSpy = jest.fn() as unknown as jest.SpiedFunction<
  (typeof import('@actions/exec'))['exec']
>;

const getInputSpy = jest.fn() as unknown as jest.SpiedFunction<
  (typeof import('@actions/core'))['getInput']
>;

jest.unstable_mockModule('@actions/core', (): unknown => ({
  getInput: getInputSpy,
  setOutput: jest.fn(),
}));

jest.unstable_mockModule('@actions/exec', (): unknown => ({
  exec: execSpy,
}));

const { InputParameters } = await import('./utilities/inputProcessors.js');

type JestSpyBooleanPromise = jest.SpiedFunction<() => Promise<boolean>>;
const optionsOverride = {
  addChannel: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(true),
  prepare: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(true),
  publish: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(true),
  success: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(true),
  verifyConditions: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(
    true,
  ),
  verifyRelease: (jest.fn() as JestSpyBooleanPromise).mockResolvedValue(true),
};

beforeAll((): void => {
  // eslint-disable-next-line functional/immutable-data
  process.env.GITHUB_EVENT_NAME = 'push';
  // eslint-disable-next-line functional/immutable-data
  process.env.GITHUB_REF = 'master';
});

beforeEach(async (): Promise<void> => {
  await $`git config --global init.defaultBranch master`;

  execSpy.mockImplementation(async (): Promise<number> => 0);
  getInputSpy.mockImplementation((name: string): string => {
    if (name === InputParameters.CommitAssets) {
      return './src';
    }

    if (name === InputParameters.DryRun) {
      return 'true';
    }

    if (name === InputParameters.NodeModule) {
      return 'true';
    }

    if (name === InputParameters.ReleaseAssets) {
      return './src';
    }

    if (name === InputParameters.ReleaseBranches) {
      return JSON.stringify([
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        'next',
        'next-major',
        { name: 'beta', prerelease: 'beta' },
        { name: 'alpha', prerelease: 'alpha' },
      ]);
    }

    if (name === InputParameters.ReleaseRules) {
      return '';
    }

    return '';
  });
});

describe('release', (): void => {
  it('"feat" makes a minor release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['feat: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('minor');
      expect(result.nextRelease.version).toBe('1.1.0');
    }
  });

  it('"feat" with a BREAKING CHANGE makes a major release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();

    await gitCommits(
      ['feat: add a major change\n\nBREAKING CHANGE: break something'],
      { cwd },
    );
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('major');
      expect(result.nextRelease.version).toBe('2.0.0');
    }
  });

  it('"fix" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['fix: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"perf" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['perf: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"build" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['build: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"ci" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['ci: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"docs" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['docs: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"improvement" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['improvement: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"refactor" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(3);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['refactor: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).not.toBe(false);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('makes no release when subject includes skip release', async (): Promise<void> => {
    expect.assertions(1);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['feat: [skip release]'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const { release } = await import('./release.js');
    const result = await release(optionsOverride, configurationOverride);

    expect(result).toBe(false);
  });
});
