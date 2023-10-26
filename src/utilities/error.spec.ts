import { getSetFailedErrorString } from './error';

interface TestCase {
  expected: string[] | string;
  messageOrError: unknown;
}

describe('getSetFailedErrorString', (): void => {
  it.each<[string, TestCase]>([
    [
      'an Error',
      {
        expected: 'This is an error message',
        messageOrError: new Error('This is an error message'),
      },
    ],
    [
      'a string',
      {
        expected: 'This is an error message',
        messageOrError: 'This is an error message',
      },
    ],
    [
      'an array',
      {
        expected: "[ 'This is an error message' ]",
        messageOrError: ['This is an error message'],
      },
    ],
    [
      'a boolean',
      {
        expected: 'true',
        messageOrError: true,
      },
    ],
    ['null', { expected: 'null', messageOrError: null }],
    [
      'an object',
      {
        expected: "{ level: 'top', message: 'this is an error' }",
        messageOrError: {
          level: 'top',
          message: 'this is an error',
        },
      },
    ],
  ])(
    'returns the right value for %s',
    (_, { messageOrError, expected }: TestCase): void => {
      expect.assertions(1);
      const result = getSetFailedErrorString(messageOrError);

      expect(result).toStrictEqual(expected);
    },
  );
});
