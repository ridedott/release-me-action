import { setFailed } from '@actions/core';
import { Config, Options, Result } from 'semantic-release';

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

type SemanticRelease = (
  options: Options,
  environment?: Config,
) => Promise<Result>;

export const release = async (
  overrideOptions?: Options,
  overrideConfig?: Config,
): Promise<Result> => {
  await installDependencies();

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  const branches = processInputReleaseBranches();

  const { pluginsOverrides = [], ...otherOptionOverrides } =
    overrideOptions ?? {};

  /* istanbul ignore next */
  const result: Result = await semanticRelease(
    {
      ...(branches === undefined ? {} : { branches }),
      dryRun: processInputDryRun(),
      plugins: [
        ...generatePlugins({
          commitAssets: processInputCommitAssets(),
          disableChangeLog: processInputDisableChangelog(),
          isNodeModule: processInputNodeModule(),
          releaseAssets: processInputReleaseAssets(),
          releaseRules: processInputReleaseRules(),
        }),
        ...pluginsOverrides,
      ],
      ...otherOptionOverrides,
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
