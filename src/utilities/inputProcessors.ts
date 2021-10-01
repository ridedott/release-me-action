import { getInput } from '@actions/core';
import * as joi from '@hapi/joi';
import { BranchSpec } from 'semantic-release';

const MATCH_CONFIG_FILE_EXTENSION_REGEXP = /\.(?:ya?ml|js)$/u;

export interface AdditionalPluginsSpec {
  [plugin: string]: string;
}

export enum InputParameters {
  AdditionalPlugins = 'additional-plugins',
  CommitAssets = 'commit-assets',
  ConfigFile = 'config-file',
  DisableChangelog = 'disable-generate-changelog',
  DryRun = 'dry-run',
  NodeModule = 'node-module',
  ReleaseAssets = 'release-assets',
  ReleaseBranches = 'release-branches',
  ReleaseRules = 'release-rules',
  ReleaseRulesAppend = 'release-rules-append',
}

export interface ReleaseRule {
  release: string | false;
  scope?: string;
  subject?: string;
  type?: string;
}

/**
 * These rules extend the default rules provided by commit-analyzer.
 * Added rules are types supported by commitizen but not supported in standard
 * commit-analyzer. Rules are based on Angular contribution guidelines:
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular#type
 */
export const DEFAULT_RELEASE_RULES: ReleaseRule[] = [
  { release: 'patch', type: 'build' },
  { release: 'patch', type: 'chore' },
  { release: 'patch', type: 'ci' },
  { release: 'patch', type: 'docs' },
  { release: 'patch', type: 'improvement' },
  { release: 'patch', type: 'refactor' },
  { release: false, subject: '*\\[skip release\\]*' },
];

const inputAdditionalPluginsSchema = joi
  .object()
  .pattern(joi.string(), joi.string());

const inputReleaseBranchesSchema = joi
  .array()
  .items(
    joi.string(),
    joi.object().keys({
      channel: joi.alternatives().try(joi.string(), false).optional(),
      name: joi.string().min(1).required(),
      prerelease: joi.alternatives().try(joi.string(), true).optional(),
      range: joi.string().optional(),
    }),
  )
  .min(1);

const inputReleaseRulesSchema = joi
  .array()
  .items(
    joi.object().keys({
      release: joi
        .alternatives()
        .try(
          'major',
          'premajor',
          'minor',
          'preminor',
          'patch',
          'prepatch',
          'prerelease',
          false,
        )
        .required(),
      scope: joi.string().optional(),
      subject: joi.string().optional(),
      type: joi.string().optional(),
    }),
  )
  .min(1);

const parseFileList = (input: string): string[] =>
  input
    .split('\n')
    .map((assetPath: string): string => assetPath.trim())
    .filter((assetPath: string): boolean => assetPath.length > 0);

const parseInputAdditionalPlugins = (input: string): unknown => {
  try {
    return JSON.parse(input);
  } catch (error: unknown) {
    throw new Error(
      'Invalid JSON string for input parameter additional-plugins.',
    );
  }
};

const parseInputReleaseBranches = (input: string): unknown => {
  try {
    return JSON.parse(input);
  } catch (error: unknown) {
    throw new Error(
      'Invalid JSON string for input parameter release-branches.',
    );
  }
};

const parseInputReleaseRules = (input: string): unknown => {
  try {
    return JSON.parse(input);
  } catch (error: unknown) {
    throw new Error('Invalid JSON string for input parameter release-rules.');
  }
};

const validateInputAdditionalPlugins = (
  input: unknown,
): AdditionalPluginsSpec => {
  const { error, value } = inputAdditionalPluginsSchema.validate(input, {
    stripUnknown: true,
  });

  if (error !== undefined) {
    throw new Error(
      `Invalid value for input parameter additional-plugins: ${
        error.message
      }\n${JSON.stringify(error.details)} `,
    );
  }

  return value;
};

const validateInputReleaseBranches = (input: unknown): BranchSpec[] => {
  const { error, value } = inputReleaseBranchesSchema.validate(input, {
    stripUnknown: true,
  });

  if (error !== undefined) {
    throw new Error(
      `Invalid value for input parameter release-branches: ${
        error.message
      }\n${JSON.stringify(error.details)} `,
    );
  }

  return value;
};

const validateInputReleaseRules = (input: unknown): ReleaseRule[] => {
  const { error, value } = inputReleaseRulesSchema.validate(input, {
    stripUnknown: true,
  });

  if (error !== undefined) {
    throw new Error(
      `Invalid value for input parameter release-rules: ${
        error.message
      }\n${JSON.stringify(error.details)} `,
    );
  }

  return value;
};

export const processInputAdditionalPlugins = ():
  | AdditionalPluginsSpec
  | undefined => {
  const input = getInput(InputParameters.AdditionalPlugins);

  if (input.length === 0) {
    return;
  }

  const parsedInput = parseInputAdditionalPlugins(input);

  return validateInputAdditionalPlugins(parsedInput);
};

export const processInputNodeModule = (): boolean =>
  getInput(InputParameters.NodeModule) === 'true';

export const processInputDisableChangelog = (): boolean =>
  getInput(InputParameters.DisableChangelog) === 'true';

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

export const processInputConfigFile = (): string | undefined => {
  const file = getInput(InputParameters.ConfigFile);

  if (file.length === 0) {
    return;
  }

  if (MATCH_CONFIG_FILE_EXTENSION_REGEXP.exec(file) === null) {
    throw new Error('Config file should be a JavaScript or YAML file');
  }

  return file;
};

export const processInputReleaseRules = (): ReleaseRule[] => {
  const input = getInput(InputParameters.ReleaseRules);
  const appendInput = getInput(InputParameters.ReleaseRulesAppend);

  /**
   * Using release-rules-append when release rules empty in the config
   * Allow to user to append rules onto end of default rules set
   * instead of replacing them.
   */

  if (input.length > 0 && appendInput.length > 0) {
    throw new Error(
      'Invalid input release-rules-append and release rules cannot both be used.',
    );
  }

  if (appendInput.length > 0) {
    const parsedAppendInput = parseInputReleaseRules(appendInput);
    const validAppendInputRules = validateInputReleaseRules(parsedAppendInput);

    return [...DEFAULT_RELEASE_RULES, ...validAppendInputRules];
  }

  if (input.length === 0) {
    return DEFAULT_RELEASE_RULES;
  }

  const parsedInput = parseInputReleaseRules(input);

  return validateInputReleaseRules(parsedInput);
};

export const processInputCommitAssets = (): string[] =>
  parseFileList(getInput(InputParameters.CommitAssets));

export const processInputReleaseAssets = (): string[] =>
  parseFileList(getInput(InputParameters.ReleaseAssets));
