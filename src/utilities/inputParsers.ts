import { getInput } from '@actions/core';

interface BranchObjectConfiguration {
  name: string;
  prerelease: boolean;
}

enum InputParameters {
  DryRun = 'dry-run',
  ReleaseBranches = 'release-branches',
  CommitAssets = 'commit-assets',
  ReleaseAssets = 'release-assets',
  NodeModule = 'node-module',
}

const parseFileList = (input: string): string[] =>
  input
    .split('\n')
    .map((assetPath: string): string => assetPath.trim())
    .filter((assetPath: string): boolean => assetPath.length > 0);

export const parseInputNodeModule = (): boolean =>
  getInput(InputParameters.NodeModule) === 'true';

export const parseInputDryRun = (): boolean =>
  getInput(InputParameters.DryRun) === 'true';

export const parseInputReleaseBranch = ():
  | Array<string | BranchObjectConfiguration>
  | undefined => {
  const input = getInput(InputParameters.ReleaseBranches);

  if (input.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(input);
  } catch (_) {
    return [{ name: input, prerelease: false }];
  }
};

export const parseInputCommitAssets = (): string[] =>
  parseFileList(getInput(InputParameters.CommitAssets));

export const parseInputReleaseAssets = (): string[] =>
  parseFileList(getInput(InputParameters.ReleaseAssets));
