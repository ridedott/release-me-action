import type { Options } from 'execa';
/**
 * Initialize local `remote` git repository in a temporary temporaryDirectory.
 */
export declare const initGitRemote: () => Promise<{
    cwd: string;
    remoteRepositoryUrl: string;
}>;
/**
 * Create a shallow clone of a git repository. The shallow will contain a
 * limited number of commit and no tags.
 */
export declare const gitShallowClone: (repositoryUrl: string, depth?: number) => Promise<string>;
/**
 * Create commits on the git repository present in the `cwd` option.
 */
export declare const gitCommits: (messages: string[], execaOptions: Options) => Promise<void>;
/**
 * Create a tag on the head commit on the git repository present in the `cwd`
 * option.
 */
export declare const gitTagVersion: (tagName: string, execaOptions: Options) => Promise<void>;
/**
 * Creates a temporary git remote repository and a git clone repository.
 */
export declare const gitRepo: () => Promise<{
    cwd: string;
    repositoryUrl: string;
}>;
/**
 * Push to the remote repository from the git repository present in the `cwd`
 * option.
 */
export declare const gitPush: (repositoryUrl: string, branch: string, execaOptions: Options) => Promise<void>;
//# sourceMappingURL=git.d.ts.map