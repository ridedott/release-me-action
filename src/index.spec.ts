import * as actionsCore from '@actions/core';
import * as actionsExec from '@actions/exec';

import { release } from './index.js';
import { gitCommits, gitPush, gitRepo } from './utilities/git.js';
import { InputParameters } from './utilities/inputProcessors.js';

const execSpy = jest.spyOn(actionsExec, 'exec');
const getInputSpy = jest.spyOn(actionsCore, 'getInput');

const optionsOverride = {
  addChannel: jest.fn().mockResolvedValue(true),
  prepare: jest.fn().mockResolvedValue(true),
  publish: jest.fn().mockResolvedValue(true),
  success: jest.fn().mockResolvedValue(true),
  verifyConditions: jest.fn().mockResolvedValue(true),
  verifyRelease: jest.fn().mockResolvedValue(true),
};

describe('release', (): void => {
  beforeEach((): void => {
    execSpy.mockImplementation();
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

  it('"feat" makes a minor release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['feat: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('minor');
      expect(result.nextRelease.version).toBe('1.1.0');
    }
  });

  it('"feat" with a BREAKING CHANGE makes a major release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

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

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('major');
      expect(result.nextRelease.version).toBe('2.0.0');
    }
  });

  it('"fix" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['fix: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"perf" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['perf: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"build" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['build: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"ci" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['ci: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"docs" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['docs: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"improvement" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['improvement: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

    if (result !== false) {
      expect(result.nextRelease.type).toBe('patch');
      expect(result.nextRelease.version).toBe('1.0.1');
    }
  });

  it('"refactor" makes a patch release using the default release rules', async (): Promise<void> => {
    expect.assertions(2);

    // Generate git
    const { cwd } = await gitRepo();
    await gitCommits(['refactor: add a minor change'], { cwd });
    await gitPush('origin', 'master', { cwd });

    const configurationOverride = {
      cwd,
    };

    const result = await release(optionsOverride, configurationOverride);

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

    const result = await release(optionsOverride, configurationOverride);

    expect(result).toBe(false);
  });
});
