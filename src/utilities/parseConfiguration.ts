import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { Options } from 'semantic-release';

/**
 * Read and evaluates a yaml file at the given path and returns a
 * semantic-release configuration object.
 * @param filePath
 */
const parseYamlConfiguration = async (filePath: string): Promise<object> => {
  const file = await fs.readFile(filePath, 'utf8');

  const config = yaml.safeLoad(file) as string | object | undefined;

  if (typeof config !== 'object') {
    throw new Error('Invalid config file contents; not an object');
  }

  return config;
};

/**
 * Read and evaluates a javascript file at the given path and returns a
 * semantic-release configuration object.
 * @param filePath file path of the .js configuration file.
 * @param defaultOptions default action options that are passed to the function
 * exported by the configuration module
 */
const parseJsConfiguration = async (
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

/**
 * Returns a semantic release configuration object when given a filepath.
 * @param filePath file path of the .yaml or .js configuration file.
 * @param defaultOptions default action options that are passed to the function
 * exported by the .js configuration module.
 */
export const parseConfiguration = async (
  filePath: string,
  defaultOptions: Options,
): Promise<object> => {
  const extension = filePath.split('.').pop();

  switch (extension) {
    case 'js':
      return parseJsConfiguration(filePath, defaultOptions);
    default:
      return parseYamlConfiguration(filePath);
  }
};
