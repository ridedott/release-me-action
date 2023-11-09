import type { Options } from 'semantic-release';
/**
 * Returns a semantic release configuration object when given a filepath.
 * @param filePath File path of the .yaml or .js configuration file.
 * @param defaultOptions Default action options that are passed to the function
 * exported by the .js configuration module.
 */
export declare const parseConfiguration: (filePath: string, defaultOptions: Options) => Promise<object>;
//# sourceMappingURL=parseConfiguration.d.ts.map