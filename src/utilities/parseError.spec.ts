import { handleMessageOrError } from './parseError';

describe('handleMessageOrError', (): void => {
  const testCases = [
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

  testCases.forEach((test) => {
    it(`given an Error: ${test.messageOrError} should return: ${test.expected}`, (): void => {
      expect.assertions(1);
      const result = handleMessageOrError(test.messageOrError);

      expect(result).toStrictEqual(test.expected);
    });
  });
});
