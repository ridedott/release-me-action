import { $ } from 'execa';

import {
  gitCommits,
  gitPush,
  gitRepo,
  gitShallowClone,
  gitTagVersion,
  initGitRemote,
} from './git.js';

describe('git utility', (): void => {
  describe('initGitRemote', (): void => {
    it('initializes local `remote` git repository in a temporary directory', async (): Promise<void> => {
      expect.assertions(1);

      const { cwd } = await initGitRemote();

      const isBareRepository = (
        await $({ cwd })`git rev-parse --is-bare-repository`
      ).stdout;

      expect(isBareRepository).toBe('true');
    });
  });

  describe('gitShallowClone', (): void => {
    it('creates a shallow clone of a `remote` git repository', async (): Promise<void> => {
      expect.assertions(1);

      const { remoteRepositoryUrl } = await initGitRemote();
      const cloneWorkingDirectory = await gitShallowClone(remoteRepositoryUrl);

      const { stdout: isGitRepository } = await $({
        cwd: cloneWorkingDirectory,
      })`git rev-parse --git-dir`;

      expect(isGitRepository).toBe('.git');
    });
  });

  describe('gitCommits', (): void => {
    it('creates commits on the git repository present in the `cwd` option', async (): Promise<void> => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(['feat: initial commit'], {
        cwd,
      });

      const commitMessage = (await $({ cwd })`git log -1 --pretty=%s`).stdout;

      expect(commitMessage).toBe('feat: initial commit');
    });

    it('creates commits in order on the git repository present in the `cwd` option', async (): Promise<void> => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(
        ['feat: initial commit', 'feat: second commit', 'feat: third commit'],
        { cwd },
      );

      const commitMessages = (await $({ cwd })`git log -3 --pretty=%s`).stdout;

      expect(commitMessages).toMatchInlineSnapshot(`
        "feat: third commit
        feat: second commit
        feat: initial commit"
      `);
    });
  });

  describe('gitTagVersion', (): void => {
    it('creates a tag on the head commit of the repository present in the `cwd` option', async (): Promise<void> => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(['feat: second commit'], {
        cwd,
      });
      await gitTagVersion('v1.1.0', { cwd });

      const tagName = (await $({ cwd })`git describe --tags`).stdout;

      expect(tagName).toContain('v1.1.0');
    });
  });

  describe('gitRepo', (): void => {
    it('creates a temporary git remote repository and a git clone repository', async (): Promise<void> => {
      expect.assertions(5);

      const { cwd } = await gitRepo();

      const configurationUserName = (
        await $({ cwd })`git config --get user.name`
      ).stdout;

      const configurationUserEmail = (
        await $({ cwd })`git config --get user.email`
      ).stdout;

      const configurationGpgSign = (
        await $({ cwd })`git config --get commit.gpgsign`
      ).stdout;

      const commitMessage = (await $({ cwd })`git log -1 --pretty=%s`).stdout;

      const tagName = (await $({ cwd })`git describe --tags`).stdout;

      expect(commitMessage).toBe('feat: initial commit');
      expect(configurationUserName).toBe('test@ridedott.com');
      expect(configurationUserEmail).toBe('test@ridedott.com');
      expect(configurationGpgSign).toBe('false');
      expect(tagName).toContain('v1.0.0');
    });
  });

  describe('gitPush', (): void => {
    it('pushes to the remote repository from the git repository present in the `cwd` option', async (): Promise<void> => {
      expect.assertions(1);

      await $`git config --global init.defaultBranch master`;

      const { cwd: remoteWorkingDirectory, remoteRepositoryUrl } =
        await initGitRemote();
      const cloneWorkingDirectory = await gitShallowClone(remoteRepositoryUrl);
      const options = { cwd: cloneWorkingDirectory };
      const $$ = $(options);

      await $$`git config user.email test@ridedott.com`;
      await $$`git config user.name test@ridedott.com`;
      await $$`git config commit.gpgsign false`;
      await gitCommits(['feat: initial commit'], options);
      await gitPush('origin', 'master', options);

      const { stdout: commitMessage } = await $({
        cwd: remoteWorkingDirectory,
      })`git log -1 --pretty=%s`;

      expect(commitMessage).toBe('feat: initial commit');
    });
  });
});
