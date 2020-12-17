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

const branches = processInputReleaseBranches();
const configFile = processInputConfigFile();

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

export const release = async (
  overrideOptions?: Options,
  overrideConfig?: Config,
): Promise<Result> => {
  await installDependencies();

  const semanticRelease = ((await import(
    'semantic-release'
  )) as unknown) as SemanticRelease;

  /* istanbul ignore next */
  const result: Result = await semanticRelease(
    {
      ...defaultOptions,
      ...overrideOptions,
      ...(configFile === undefined
        ? {}
        : await getConfig(configFile, defaultOptions)),
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
