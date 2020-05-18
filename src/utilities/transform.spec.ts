import { Commit } from 'conventional-commits-parser';

import { transform } from './transform';

/**
 * The type is a union because inconsistent typing definitions
 * in the commit-parser library.
 */
const makeCommit = (
  overrides: { [key: string]: Commit.Field | object } = {},
): Commit => {
  /*
   * This ts-ignore relates to the types provided by the commit-parser
   * being incorrect.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return {
    body: null,
    footer: null,
    header: null,
    mentions: [],
    merge: null,
    notes: [],
    references: [],
    revert: null,
    type: 'random',
    ...overrides,
  };
};

describe('transform', (): void => {
  it.each([
    { commit: makeCommit({ type: 'build' }), expectedType: 'Build System' },
    {
      commit: makeCommit({ type: 'ci' }),
      expectedType: 'Continuous Integration',
    },
    { commit: makeCommit({ type: 'chore' }), expectedType: 'Chores' },
    { commit: makeCommit({ type: 'docs' }), expectedType: 'Documentation' },
    { commit: makeCommit({ type: 'feat' }), expectedType: 'Features' },
    { commit: makeCommit({ type: 'fix' }), expectedType: 'Bug Fixes' },
    {
      commit: makeCommit({ type: 'improvement' }),
      expectedType: 'Improvements',
    },
    { commit: makeCommit({ type: 'perf' }), expectedType: 'Performance' },
    {
      commit: makeCommit({ type: 'refactor' }),
      expectedType: 'Code Refactoring',
    },
    { commit: makeCommit({ type: 'revert' }), expectedType: 'Reverts' },
    { commit: makeCommit({ type: 'style' }), expectedType: 'Code Style' },
    { commit: makeCommit({ type: 'test' }), expectedType: 'Tests' },
    { commit: makeCommit({ type: 'random' }), expectedType: 'Other' },
  ])(
    'transforms the type property of the input commit',
    ({
      commit,
      expectedType,
    }: {
      commit: Commit;
      expectedType: string;
    }): void => {
      expect.assertions(1);

      const result = transform(commit) as Commit;

      expect(result.type).toStrictEqual(expectedType);
    },
  );

  it('adds the commit short hash as a root property of the commit when it exists on the input', (): void => {
    expect.assertions(1);

    const result = transform(
      makeCommit({
        commit: {
          short: 'short-hash',
        },
      }),
    ) as Commit;

    expect(result.shortHash).toStrictEqual('short-hash');
  });

  it('omits adding the commit short hash as a property of the commit when it does not exist on the input', (): void => {
    expect.assertions(1);

    const result = transform(makeCommit()) as Commit;

    expect(result.shortHash).toBeUndefined();
  });
});
