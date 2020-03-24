import { setFailed } from '@actions/core';
import { Config, Options, Result } from 'semantic-release';

import { generatePlugins } from './utilities/generatePlugins';
import {
  parseInputCommitAssets,
  parseInputDryRun,
  parseInputNodeModule,
  parseInputReleaseAssets,
  parseInputReleaseBranch,
} from './utilities/inputParsers';
import { installDependencies } from './utilities/installDependencies';
import { transform } from './utilities/transform';

type SemanticRelease = (
  options: Options,
  environment?: Config,
) => Promise<Result>;

const parseOptions = {
  mergeCorrespondence: ['id', 'source'],
  // eslint-disable-next-line prefer-named-capture-group,require-unicode-regexp
  mergePattern: /^Merge pull request #(\d+) from (.*)$/,
};

/**
 * These rules extend the default rules provided by commit-analyzer.
 * Added rules are types supported by commitizen but not supported in standard
 * commit-analyzer. Rules are based on Angular contribution guidelines:
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular#type
 */
const releaseRulesExtension = [
  { release: 'patch', scope: 'deps', type: 'chore' },
  { release: 'patch', type: 'improvement' },
  { release: 'patch', type: 'refactor' },
];

const writerOptions = {
  transform,
};

export const release = async (): Promise<void> => {
  await installDependencies();

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  const branches = parseInputReleaseBranch();
  console.log('branches', branches);

  await semanticRelease({
    /* eslint-disable unicorn/prevent-abbreviations */
    ...(branches === undefined ? {} : { branches }),
    debug: true,
    dryRun: parseInputDryRun(),
    parserOpts: parseOptions,
    plugins: generatePlugins({
      commitAssets: parseInputCommitAssets(),
      isNodeModule: parseInputNodeModule(),
      releaseAssets: parseInputReleaseAssets(),
    }),
    releaseRules: releaseRulesExtension,
    writerOpts: writerOptions,
    /* eslint-enable unicorn/prevent-abbreviations */
  });
};

release().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
