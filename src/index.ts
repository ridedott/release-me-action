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

// These rules extend the default rules provided by commit-analyzer.
const releaseRulesExtension = [
  { release: 'patch', type: 'build' },
  { release: 'patch', type: 'ci' },
  { release: 'patch', type: 'chore' },
  { release: 'patch', type: 'docs' },
  { release: 'patch', type: 'improvement' },
  { release: 'patch', type: 'refactor' },
  { release: 'patch', type: 'style' },
  { release: 'patch', type: 'test' },
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

  await semanticRelease({
    /* eslint-disable unicorn/prevent-abbreviations */
    ...(branches === undefined ? {} : { branches }),
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
