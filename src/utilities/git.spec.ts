import * as execa from 'execa';

import {
  gitCommits,
  gitPush,
  gitRepo,
  gitShallowClone,
  gitTagVersion,
  initGitRemote,
} from './git';

describe('git utility', (): void => {
  describe('initGitRemote', (): void => {
    it('initializes local `remote` git repository in a temporary directory', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const { cwd } = await initGitRemote();

      const isBareRepository = (
        await execa('git', ['rev-parse', '--is-bare-repository'], {
          cwd,
        })
      ).stdout;

      expect(isBareRepository).toStrictEqual('true');
    });
  });

  describe('gitShallowClone', (): void => {
    it('creates a shallow clone of a `remote` git repository', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const { remoteRepositoryUrl } = await initGitRemote();
      const cloneWorkingDirectory = await gitShallowClone(remoteRepositoryUrl);

      const isGitRepository = (
        await execa('git', ['rev-parse', '--git-dir'], {
          cwd: cloneWorkingDirectory,
        })
      ).stdout;

      expect(isGitRepository).toStrictEqual('.git');
    });
  });

  describe('gitCommits', (): void => {
    it('creates commits on the git repository present in the `cwd` option', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(['feat: initial commit'], {
        cwd,
      });

      const commitMessage = (
        await execa('git', ['log', '-1', '--pretty=%s'], {
          cwd,
        })
      ).stdout;

      expect(commitMessage).toStrictEqual('feat: initial commit');
    });

    it('creates commits in order on the git repository present in the `cwd` option', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(
        ['feat: initial commit', 'feat: second commit', 'feat: third commit'],
        { cwd },
      );

      const commitMessages = (
        await execa('git', ['log', '-3', '--pretty=%s'], {
          cwd,
        })
      ).stdout;

      expect(commitMessages).toMatchInlineSnapshot(`
        "feat: third commit
        feat: second commit
        feat: initial commit"
      `);
    });
  });

  describe('gitTagVersion', (): void => {
    it('creates a tag on the head commit of the repository present in the `cwd` option', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const { cwd } = await gitRepo();

      await gitCommits(['feat: second commit'], {
        cwd,
      });
      await gitTagVersion('v1.1.0', { cwd });

      const tagName = (
        await execa('git', ['describe', '--tags'], {
          cwd,
        })
      ).stdout;

      expect(tagName).toContain('v1.1.0');
    });
  });

  describe('gitRepo', (): void => {
    it('creates a temporary git remote repository and a git clone repository', async (): Promise<
      void
    > => {
      expect.assertions(5);

      const { cwd } = await gitRepo();

      const configurationUserName = (
        await execa('git', ['config', '--get', 'user.name'], {
          cwd,
        })
      ).stdout;

      const configurationUserEmail = (
        await execa('git', ['config', '--get', 'user.email'], {
          cwd,
        })
      ).stdout;

      const configurationGpgSign = (
        await execa('git', ['config', '--get', 'commit.gpgsign'], {
          cwd,
        })
      ).stdout;

      const commitMessage = (
        await execa('git', ['log', '-1', '--pretty=%s'], {
          cwd,
        })
      ).stdout;

      const tagName = (
        await execa('git', ['describe', '--tags'], {
          cwd,
        })
      ).stdout;

      expect(commitMessage).toStrictEqual('feat: initial commit');
      expect(configurationUserName).toStrictEqual('test@ridedott.com');
      expect(configurationUserEmail).toStrictEqual('test@ridedott.com');
      expect(configurationGpgSign).toStrictEqual('false');
      expect(tagName).toContain('v1.0.0');
    });
  });

  describe('gitPush', (): void => {
    it('pushes to the remote repository from the git repository present in the `cwd` option', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const {
        cwd: remoteWorkingDirectory,
        remoteRepositoryUrl,
      } = await initGitRemote();
      const cloneWorkingDirectory = await gitShallowClone(remoteRepositoryUrl);

      await execa('git', ['config', 'user.email', 'test@ridedott.com'], {
        cwd: cloneWorkingDirectory,
      });
      await execa('git', ['config', 'user.name', 'test@ridedott.com'], {
        cwd: cloneWorkingDirectory,
      });
      await execa('git', ['config', 'commit.gpgsign', 'false'], {
        cwd: cloneWorkingDirectory,
      });
      await gitCommits(['feat: initial commit'], {
        cwd: cloneWorkingDirectory,
      });
      await gitPush('origin', 'master', { cwd: cloneWorkingDirectory });

      const commitMessage = (
        await execa('git', ['log', '-1', '--pretty=%s'], {
          cwd: remoteWorkingDirectory,
        })
      ).stdout;

      expect(commitMessage).toStrictEqual('feat: initial commit');
    });
  });
});
