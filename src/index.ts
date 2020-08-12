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

export const release = async (
  overrideOptions?: Options,
  overrideConfig?: Config,
): Promise<Result> => {
  await installDependencies();

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  const branches = processInputReleaseBranches();
  const releaseRules = processInputReleaseRules();

  /* istanbul ignore next */
  const result: Result = await semanticRelease(
    {
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
      ...(overrideOptions === undefined ? {} : overrideOptions),
      /* eslint-enable unicorn/prevent-abbreviations */
    },
    { ...(overrideConfig === undefined ? {} : overrideConfig) },
  );

  return result;
};

release()
  .then(reportResults)
  .catch((error: Error): void => {
  setFailed(JSON.stringify(error));
});
