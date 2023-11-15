import type { Commit } from 'conventional-commits-parser';

const extractShortHash = (commit: Commit): string | undefined => {
  if (commit.commit === null || commit.commit === undefined) {
    return undefined;
  }

  /*
   * This ts-ignore relates to the types provided by the commit-parser
   * being incorrect.
   */
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-expect-error
  return commit.commit.short;
};

const transformCommitType = (commit: Commit): string => {
  switch (commit.type) {
    case 'build':
      return 'Build System';
    case 'chore':
      return 'Chores';
    case 'ci':
      return 'Continuous Integration';
    case 'docs':
      return 'Documentation';
    case 'feat':
      return 'Features';
    case 'fix':
      return 'Bug Fixes';
    case 'improvement':
      return 'Improvements';
    case 'perf':
      return 'Performance';
    case 'refactor':
      return 'Code Refactoring';
    case 'revert':
      return 'Reverts';
    case 'style':
      return 'Code Style';
    case 'test':
      return 'Tests';
    default:
      return 'Other';
  }
};

export const transform = (commit: Commit): unknown => {
  const type = transformCommitType(commit);
  const shortHash = extractShortHash(commit);

  return {
    ...commit,
    ...(shortHash === undefined ? {} : { shortHash }),
    type,
  };
};
