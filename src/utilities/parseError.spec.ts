import { handleMessageOrError } from './parseError';

interface TestCase {
  expected: string,
  messageOrError: unknown
}

describe('handleMessageOrError', (): void => {
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

  testCases.forEach((test): void => {
    it(`given an Error: ${test.messageOrError} should return: ${test.expected}`, (): void => {
      expect.assertions(1);
      const result = handleMessageOrError(test.messageOrError);

      expect(result).toStrictEqual(test.expected);
    });
  });
});
