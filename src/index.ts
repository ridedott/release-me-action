import { setFailed } from '@actions/core';
import { Config, Options, PluginSpec, Result } from 'semantic-release';

import { generatePlugins } from './utilities/generatePlugins';
import { getConfig } from './utilities/getConfig';
import {
  processInputCommitAssets,
  processInputConfigFile,
  processInputDisableChangelog,
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

  const { pluginsOverrides = [], ...otherOptionOverrides } =
    overrideOptions ?? {};

  /* istanbul ignore next */
  const result: Result = await semanticRelease(
    {
      /* eslint-disable unicorn/prevent-abbreviations */
      ...(branches === undefined ? {} : { branches }),
      dryRun: processInputDryRun(),
      parserOpts: parseOptions,
      plugins: [
        ...generatePlugins({
          commitAssets: processInputCommitAssets(),
          disableChangeLog: processInputDisableChangelog(),
          isNodeModule: processInputNodeModule(),
          releaseAssets: processInputReleaseAssets(),
        }),
        ...pluginsOverrides,
      ],
      preset: 'angular',
      releaseRules,
      writerOpts: writerOptions,
      ...otherOptionOverrides,
      /* eslint-enable unicorn/prevent-abbreviations */
    },
    { ...(overrideConfig === undefined ? {} : overrideConfig) },
  );

  return result;
};

const configFile = processInputConfigFile();

Promise.resolve(
  /* istanbul ignore next */
  configFile === undefined ? {} : getConfig(configFile),
)
  .then(async (config: object): Promise<Result> => release(config))
  .then(reportResults)
  .catch((error: Error): void => {
    setFailed(JSON.stringify(error));
  });
