import { setFailed } from '@actions/core';
import { Config, Options, Result } from 'semantic-release';

import { generatePlugins } from './utilities/generatePlugins';
import {
  processInputAdditionalPlugins,
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
import { parseConfiguration } from './utilities/parseConfiguration';

type SemanticRelease = (
  options: Options,
  environment?: Config,
) => Promise<Result>;

export const release = async (
  overrideOptions?: Options,
  overrideConfig?: Config,
): Promise<Result> => {
  const additionalPlugins = processInputAdditionalPlugins();

  await installDependencies(additionalPlugins);

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  const branches = processInputReleaseBranches();
  const configFile = processInputConfigFile();

  /* istanbul ignore next */
  const defaultOptions = {
    ...(branches === undefined ? {} : { branches }),
    dryRun: processInputDryRun(),
    plugins: generatePlugins({
      commitAssets: processInputCommitAssets(),
      disableChangeLog: processInputDisableChangelog(),
      isNodeModule: processInputNodeModule(),
      releaseAssets: processInputReleaseAssets(),
      releaseRules: processInputReleaseRules(),
    }),
  };

  /* istanbul ignore next */
  const result: Result = await semanticRelease(
    {
      ...defaultOptions,
      ...(configFile === undefined
        ? {}
        : await parseConfiguration(configFile, defaultOptions)),
      ...overrideOptions,
    },
    overrideConfig ?? {},
  );

  return result;
};

release()
  .then(reportResults)
  .catch((error: unknown): void => {
    setFailed(JSON.stringify(error));
  });
