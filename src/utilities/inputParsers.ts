import { getInput } from '@actions/core';
import * as fs from 'fs';

const parseFileList = (input: string): string[] =>
  input
    .split('\n')
    .map((assetPath: string): string => assetPath.trim())
    .filter((assetPath: string): boolean => assetPath.length > 0)
    .reduce((accumulator: string[], assetPath: string): string[] => {
      // eslint-disable-next-line no-sync
      if (fs.existsSync(assetPath)) {
        return [...accumulator, assetPath];
      }

      return accumulator;
    }, []);

export const parseInputNodeModule = (): boolean =>
  getInput('node-module') === 'true';

export const parseInputDryRun = (): boolean => getInput('dry-run') === 'true';

export const parseInputReleaseBranch = (): string => getInput('release-branch');

export const parseInputCommitAssets = (): string[] =>
  parseFileList(getInput('commit-assets'));

export const parseInputReleaseAssets = (): string[] =>
  parseFileList(getInput('release-assets'));
