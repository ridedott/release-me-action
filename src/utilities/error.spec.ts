import { getSetFailedErrorString } from './error.js';
interface TestCase {
  expected: string;
  messageOrError: unknown;
}

describe('getSetFailedErrorString', (): void => {
  const testCases: TestCase[] = [
    {
      expected: 'This is an error message',
      messageOrError: new Error('This is an error message'),
    },
    {
      expected: 'This is an error message',
      messageOrError: 'This is an error message',
    },
    {
      expected: "[ 'This is an error message' ]",
      messageOrError: ['This is an error message'],
    },
    {
      expected: 'true',
      messageOrError: true,
    },
    {
      expected: 'null',
      messageOrError: null,
    },
    {
      expected: "{ level: 'top', message: 'this is an error' }",
      messageOrError: {
        level: 'top',
        message: 'this is an error',
      },
    },
  ];

  it.each(testCases)('given an Error: %o return: %s', (test): void => {
    expect.assertions(1);
    const result = getSetFailedErrorString(test.messageOrError);

    expect(result).toStrictEqual(test.expected);
  });
});
