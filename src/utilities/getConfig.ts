import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';

export const getConfig = async (filePath: string): Promise<object> => {
  const file = await fs.readFile(filePath, 'utf8');

  const config = yaml.safeLoad(file) as string | object | undefined;

  if (typeof config !== 'object') {
    throw new Error('Invalid config file contents; not an object');
  }

  return config;
};
