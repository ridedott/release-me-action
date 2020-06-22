import { setFailed } from '@actions/core';
import { Config, Options, Result } from 'semantic-release';

import { generatePlugins } from './utilities/generatePlugins';
import {
  processInputCommitAssets,
  processInputDryRun,
  processInputNodeModule,
  processInputReleaseAssets,
  processInputReleaseBranches,
  processInputReleaseRules,
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

const writerOptions = {
  transform,
};

export const release = async (): Promise<void> => {
  await installDependencies();

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  const branches = processInputReleaseBranches();
  const releaseRules = processInputReleaseRules();

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
    preset: 'angular',
    releaseRules,
    writerOpts: writerOptions,
    /* eslint-enable unicorn/prevent-abbreviations */
  });

  reportResults(result);
};

release().catch((error: Error): void => {
  console.error(error);
  setFailed(JSON.stringify(error));
});
