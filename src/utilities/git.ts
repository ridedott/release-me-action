/* eslint-disable no-await-in-loop */
import * as execa from 'execa';
import * as fileUrl from 'file-url';
import { directory } from 'tempy';

/**
 * Initialize local `remote` git repository in a temporary directory.
 */
export const initGitRemote = async (): Promise<{
  cwd: string;
  remoteRepositoryUrl: string;
}> => {
  const cwd = directory();

  await execa('git', ['init', '--bare'], { cwd });

  return { cwd, remoteRepositoryUrl: fileUrl(cwd) };
};

/**
 * Create a shallow clone of a git repository. The shallow will contain a
 * limited number of commit and no tags.
 */
export const gitShallowClone = async (
  repositoryUrl: string,
  depth: number = 1,
): Promise<string> => {
  const cloneWorkingDirectory = directory();

  await execa(
    'git',
    [
      'clone',
      '--no-hardlinks',
      '--no-tags',
      '--depth',
      depth.toString(),
      repositoryUrl,
      cloneWorkingDirectory,
    ],
    {
      cwd: cloneWorkingDirectory,
    },
  );

  return cloneWorkingDirectory;
};

/**
 * Create commits on the git repository present in the `cwd` option.
 */
export const gitCommits = async (
  messages: string[],
  execaOptions: execa.Options,
): Promise<void> => {
  for (const message of messages) {
    await execa(
      'git',
      ['commit', '-m', message, '--allow-empty', '--no-gpg-sign'],
      execaOptions,
    );
  }
};

/**
 * Create a tag on the head commit on the git repository present in the `cwd`
 * option.
 */
export const gitTagVersion = async (
  tagName: string,
  execaOptions: execa.Options,
): Promise<void> => {
  await execa('git', ['tag', tagName], execaOptions);
};

/**
 * Creates a temporary git remote repository and a git clone repository.
 */
export const gitRepo = async (): Promise<{
  cwd: string;
  repositoryUrl: string;
}> => {
  const { remoteRepositoryUrl } = await initGitRemote();

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
  await execa('npm', ['init', '-y'], { cwd: cloneWorkingDirectory });
  await execa('git', ['add', '--all'], { cwd: cloneWorkingDirectory });
  await gitCommits(['feat: initial commit'], { cwd: cloneWorkingDirectory });
  await gitTagVersion('v1.0.0', { cwd: cloneWorkingDirectory });
  await execa('git', ['push', remoteRepositoryUrl], {
    cwd: cloneWorkingDirectory,
  });

  return { cwd: cloneWorkingDirectory, repositoryUrl: remoteRepositoryUrl };
};

/**
 * Push to the remote repository from the git repository present in the `cwd`
 * option.
 */
export const gitPush = async (
  repositoryUrl: string,
  branch: string,
  execaOptions: execa.Options,
): Promise<void> => {
  await execa(
    'git',
    ['push', '--tags', repositoryUrl, `HEAD:${branch}`],
    execaOptions,
  );
};
