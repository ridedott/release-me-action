interface BranchObjectConfiguration {
    name: string;
    prerelease: boolean;
}
export declare const parseInputNodeModule: () => boolean;
export declare const parseInputDryRun: () => boolean;
export declare const parseInputReleaseBranch: () => Array<string | BranchObjectConfiguration> | undefined;
export declare const parseInputCommitAssets: () => string[];
export declare const parseInputReleaseAssets: () => string[];
export {};
//# sourceMappingURL=inputParsers.d.ts.map