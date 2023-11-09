import type { PluginSpec } from 'semantic-release';
import type { ReleaseRule } from './inputProcessors.js';
export declare const generatePlugins: ({ commitAssets, disableChangeLog, isNodeModule, releaseAssets, releaseRules, }: {
    commitAssets: string[];
    disableChangeLog?: boolean | undefined;
    isNodeModule: boolean;
    releaseAssets: string[];
    releaseRules: ReleaseRule[];
}) => PluginSpec[];
//# sourceMappingURL=generatePlugins.d.ts.map