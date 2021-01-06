import { PluginSpec } from 'semantic-release';
import { ReleaseRule } from './inputProcessors';
export declare const generatePlugins: ({ commitAssets, disableChangeLog, isNodeModule, releaseAssets, releaseRules, }: {
    commitAssets: string[];
    disableChangeLog?: boolean | undefined;
    isNodeModule: boolean;
    releaseAssets: string[];
    releaseRules: ReleaseRule[];
}) => PluginSpec[];
//# sourceMappingURL=generatePlugins.d.ts.map