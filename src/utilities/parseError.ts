import { inspect } from 'util';

/**
 * Helper function to help the message part of the type Error
 */

export const handleMessageOrError = (messageOrError: unknown): string => {
  if (typeof messageOrError === 'string') {
    return messageOrError;
  } else if (messageOrError instanceof Error) {
    return messageOrError.message;
  }

  /**
   * Arrays, booleans, functions, objects, numbers, null and undefined objects
   * fall here.
   */
  return inspect(messageOrError);
};
