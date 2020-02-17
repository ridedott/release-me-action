import { sayHello } from './sayHello';

describe('sayHello', (): void => {
  it('returns Hello world! greeting', (): void => {
    expect.assertions(1);
    expect(sayHello()).toBe('Hello world!');
  });
});
