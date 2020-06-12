import { setFailed } from '@actions/core';
import { Config, Options, Result } from 'semantic-release';

import { generatePlugins } from './utilities/generatePlugins';
import {
  processInputCommitAssets,
  processInputDryRun,
  processInputNodeModule,
  processInputReleaseAssets,
  processInputReleaseBranches,
} from './utilities/inputProcessors';
import { installDependencies } from './utilities/installDependencies';
import { reportResults } from './utilities/outputParsers';
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
  { release: 'patch', type: 'build' },
  { release: 'patch', type: 'chore' },
  { release: 'patch', type: 'ci' },
  { release: 'patch', type: 'docs' },
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

  const branches = processInputReleaseBranches();

  const result: Result = await semanticRelease({
    /* eslint-disable unicorn/prevent-abbreviations */
    ...(branches === undefined ? {} : { branches }),
    dryRun: processInputDryRun(),
    parserOpts: parseOptions,
    plugins: generatePlugins({
      commitAssets: processInputCommitAssets(),
      isNodeModule: processInputNodeModule(),
      releaseAssets: processInputReleaseAssets(),
    }),
    releaseRules: releaseRulesExtension,
    writerOpts: writerOptions,
    /* eslint-enable unicorn/prevent-abbreviations */
  });

  reportResults(result);
};

release().catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
