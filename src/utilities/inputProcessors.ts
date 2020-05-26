import { getInput } from '@actions/core';
import * as joi from '@hapi/joi';
import { BranchSpec } from 'semantic-release';

enum InputParameters {
  DryRun = 'dry-run',
  ReleaseBranches = 'release-branches',
  CommitAssets = 'commit-assets',
  ReleaseAssets = 'release-assets',
  NodeModule = 'node-module',
}

const inputReleaseBranchesSchema = joi.array().items(
  joi.string(),
  joi.object()
    .keys({
      channel: joi.alternatives().try(
        joi.string(),
        false
      ).optional(),
      name: joi.string().min(1).required(),
      prerelease: joi.string().optional(),
      range: joi.string().optional(),
    })
).min(1)

const parseFileList = (input: string): string[] =>
  input
    .split('\n')
    .map((assetPath: string): string => assetPath.trim())
    .filter((assetPath: string): boolean => assetPath.length > 0);

const parseInputReleaseBranches = (input: string): BranchSpec[] => {
  try {
    return JSON.parse(input) as BranchSpec[];
  } catch (error) {
    throw new Error('Invalid JSON string for input parameter release-branches.');
  }
};

export const validateInputReleaseBranches = (input: BranchSpec[]): BranchSpec[] => {
  const { error, value } = inputReleaseBranchesSchema.validate(input, {
    stripUnknown: true,

  });

  if (error !== undefined) {
    throw new Error(`Invalid value for input parameter release-branches: ${error.message}\n${JSON.stringify(error.details)} `);
  }

  return value;
};

export const processInputNodeModule = (): boolean =>
  getInput(InputParameters.NodeModule) === 'true';

export const processInputDryRun = (): boolean =>
  getInput(InputParameters.DryRun) === 'true';

export const processInputReleaseBranches = (): BranchSpec[] | undefined => {
  const input = getInput(InputParameters.ReleaseBranches);

  if (input.length === 0) {
    return undefined;
  }

  const parsedInput = parseInputReleaseBranches(input);

  return validateInputReleaseBranches(parsedInput);
};



export const processInputCommitAssets = (): string[] =>
  parseFileList(getInput(InputParameters.CommitAssets));

export const processInputReleaseAssets = (): string[] =>
  parseFileList(getInput(InputParameters.ReleaseAssets));
