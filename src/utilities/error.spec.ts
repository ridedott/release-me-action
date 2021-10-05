import { getSetFailedErrorString } from './error';

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

  for (const test of testCases) {
    it(`given an Error: ${test.messageOrError} should return: ${test.expected}`, (): void => {
      expect.assertions(1);
      const result = getSetFailedErrorString(test.messageOrError);

      expect(result).toStrictEqual(test.expected);
    });
  }
});
