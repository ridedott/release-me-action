/* eslint-disable no-await-in-loop */
import { $, Options } from "execa";
import fileUrl from "file-url";
import { temporaryDirectory } from "tempy";

/**
 * Initialize local `remote` git repository in a temporary temporaryDirectory.
 */
export const initGitRemote = async (): Promise<{
  cwd: string;
  remoteRepositoryUrl: string;
}> => {
  const cwd = temporaryDirectory();

  await $({ cwd })`git init --bare`;

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
  const cloneWorkingDirectory = temporaryDirectory();

  const gitArguments = [
    "--no-hardlinks",
    "--no-tags",
    "--depth",
    depth.toString(),
    repositoryUrl,
    cloneWorkingDirectory,
  ];
  await $({ cwd: cloneWorkingDirectory })`git clone ${gitArguments}`;

  return cloneWorkingDirectory;
};

/**
 * Create commits on the git repository present in the `cwd` option.
 */
export const gitCommits = async (
  messages: string[],
  execaOptions: Options,
): Promise<void> => {
  for (const message of messages) {
    const gitArguments = ["-m", message, "--allow-empty", "--no-gpg-sign"];

    await $(execaOptions)`git commit ${gitArguments}`;
  }
};

/**
 * Create a tag on the head commit on the git repository present in the `cwd`
 * option.
 */
export const gitTagVersion = async (
  tagName: string,
  execaOptions: Options,
): Promise<void> => {
  const gitArguments = ["tag", tagName];
  await $(execaOptions)`git ${gitArguments}`;
};

/**
 * Creates a temporary git remote repository and a git clone repository.
 */
// eslint-disable-next-line max-statements
export const gitRepo = async (): Promise<{
  cwd: string;
  repositoryUrl: string;
}> => {
  const { remoteRepositoryUrl } = await initGitRemote();

  const cloneWorkingDirectory = await gitShallowClone(remoteRepositoryUrl);
  const execaOptions = { cwd: cloneWorkingDirectory };

  const gitArgumentsEmail = ["config", "user.email", "test@ridedott.com"];
  await $(execaOptions)`git ${gitArgumentsEmail}`;

  const gitArgumentsName = ["config", "user.name", "test@ridedott.com"];
  await $(execaOptions)`git ${gitArgumentsName}`;

  const gitArgumentsGpgSign = ["config", "commit.gpgsign", "false"];
  await $(execaOptions)`git ${gitArgumentsGpgSign}`;
  await $(execaOptions)`npm init -y`;
  await $(execaOptions)`git add --all`;
  await gitCommits(["feat: initial commit"], { cwd: cloneWorkingDirectory });
  await gitTagVersion("v1.0.0", { cwd: cloneWorkingDirectory });

  const gitArgumentsPush = ["push", remoteRepositoryUrl];
  await $(execaOptions)`git ${gitArgumentsPush}`;

  return { cwd: cloneWorkingDirectory, repositoryUrl: remoteRepositoryUrl };
};

/**
 * Push to the remote repository from the git repository present in the `cwd`
 * option.
 */
export const gitPush = async (
  repositoryUrl: string,
  branch: string,
  execaOptions: Options,
): Promise<void> => {
  const gitPushArguments = ["--tags", repositoryUrl, `HEAD:${branch}`];
  await $(execaOptions)`git push ${gitPushArguments}`;
};
