import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { Options } from 'semantic-release';

const getConfigYaml = async (filePath: string): Promise<object> => {
  const file = await fs.readFile(filePath, 'utf8');

  const config = yaml.safeLoad(file) as string | object | undefined;

  if (typeof config !== 'object') {
    throw new Error('Invalid config file contents; not an object');
  }

  return config;
};

const getConfigJs = async (
  filePath: string,
  defaultOptions: Options,
): Promise<object> => {
  try {
    const file = await fs.readFile(filePath, 'utf8');

    // Not harmful: script runs in sandbox environment.
    // eslint-disable-next-line no-eval
    const config = eval(file) as (object) => object;

    return config(defaultOptions);
  } catch (error: unknown) {
    throw new Error(`Could not import config file ${filePath}`);
  }
};

export const getConfig = async (
  filePath: string,
  defaultOptions: Options,
): Promise<object> => {
  const extension = filePath.split('.').pop();

  switch (extension) {
    case 'js':
      return getConfigJs(filePath, defaultOptions);
    default:
      return getConfigYaml(filePath);
  }
};
