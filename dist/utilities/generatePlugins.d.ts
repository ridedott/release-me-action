import type { PluginSpec } from 'semantic-release';
import type { ReleaseRule } from './inputProcessors.js';
export declare const generatePlugins: ({ commitAssets, disableChangeLog, isNodeModule, packageRoot, releaseAssets, releaseRules, }: {
    commitAssets: string[];
    disableChangeLog?: boolean | undefined;
    isNodeModule: boolean;
    packageRoot: string;
    releaseAssets: string[];
    releaseRules: ReleaseRule[];
}) => PluginSpec[];
//# sourceMappingURL=generatePlugins.d.ts.map