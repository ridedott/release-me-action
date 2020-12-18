import { BranchSpec } from 'semantic-release';
export interface AdditionalPluginsSpec {
    [plugin: string]: string;
}
export declare enum InputParameters {
    AdditionalPlugins = "additional-plugins",
    CommitAssets = "commit-assets",
    ConfigFile = "config-file",
    DisableChangelog = "disable-generate-changelog",
    DryRun = "dry-run",
    NodeModule = "node-module",
    ReleaseAssets = "release-assets",
    ReleaseBranches = "release-branches",
    ReleaseRules = "release-rules"
}
export interface ReleaseRule {
    release: string | false;
    scope?: string;
    subject?: string;
    type?: string;
}
/**
 * These rules extend the default rules provided by commit-analyzer.
 * Added rules are types supported by commitizen but not supported in standard
 * commit-analyzer. Rules are based on Angular contribution guidelines:
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular#type
 */
export declare const DEFAULT_RELEASE_RULES: ReleaseRule[];
export declare const processInputAdditionalPlugins: () => AdditionalPluginsSpec | undefined;
export declare const processInputNodeModule: () => boolean;
export declare const processInputDisableChangelog: () => boolean;
export declare const processInputDryRun: () => boolean;
export declare const processInputReleaseBranches: () => BranchSpec[] | undefined;
export declare const processInputConfigFile: () => string | undefined;
export declare const processInputReleaseRules: () => ReleaseRule[];
export declare const processInputCommitAssets: () => string[];
export declare const processInputReleaseAssets: () => string[];
//# sourceMappingURL=inputProcessors.d.ts.map