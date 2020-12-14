import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export const getConfig = async (
  basePath: string,
  configFile: string,
): Promise<object> => {
  const path = join(basePath, configFile);

  const file = await fs.readFile(path, 'utf8');

  const config = yaml.safeLoad(file) as string | object | undefined;

  if (typeof config !== 'object') {
    throw new Error('Invalid config file contents; not an object');
  }

  return config;
};
