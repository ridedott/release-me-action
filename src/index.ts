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

  const semanticRelease = await import('semantic-release');

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
  const result: Result = await semanticRelease.default(
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

try {
  const result = await release();

  reportResults(result);
} catch (error: unknown) {
  const finalErrorString = getSetFailedErrorString(error);

  setFailed(JSON.stringify(finalErrorString));
}
