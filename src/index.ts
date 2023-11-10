import { setFailed } from '@actions/core';
import type { Config, Options, Result } from 'semantic-release';

import { getSetFailedErrorString } from './utilities/error.js';
import { generatePlugins } from './utilities/generatePlugins.js';
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
} from './utilities/inputProcessors.js';
import { installDependencies } from './utilities/installDependencies.js';
import { reportResults } from './utilities/outputParsers.js';
import { parseConfiguration } from './utilities/parseConfiguration.js';

export const release = async (
  overrideOptions?: Options,
  overrideConfig?: Config,
): Promise<Result> => {
  const additionalPlugins = processInputAdditionalPlugins();

  await installDependencies(additionalPlugins);

  const { default: semanticRelease } = await import('semantic-release');

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
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error: unknown): void => {
    const finalErrorString = getSetFailedErrorString(error);

    setFailed(JSON.stringify(finalErrorString));
  });
