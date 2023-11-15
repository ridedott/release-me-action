import { jest } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readFileSpy = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule('fs', (): unknown => ({
  promises: {
    readFile: readFileSpy,
  },
}));

it('returns an object from a specified YAML file', async (): Promise<void> => {
  expect.assertions(2);

  const { parseConfiguration } = await import('./parseConfiguration.js');

  readFileSpy.mockResolvedValue('{foo: true}');

  const config = await parseConfiguration('./dir/config.yml', {});

  expect(config).toStrictEqual({ foo: true });
  expect(readFileSpy.mock.calls[0][0]).toBe('./dir/config.yml');
});

it('throws if the YAML file is not parsed to an object', async (): Promise<void> => {
  expect.assertions(1);

  const { parseConfiguration } = await import('./parseConfiguration.js');

  readFileSpy.mockResolvedValue('foo');

  try {
    await parseConfiguration('./dir/config.yml', {});
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
  }
});

it('returns an object from a specified JS file', async (): Promise<void> => {
  expect.assertions(1);

  const { parseConfiguration } = await import('./parseConfiguration.js');

  // eslint-disable-next-line functional/immutable-data
  global.module = {} as unknown as NodeModule;

  readFileSpy.mockResolvedValue(`
module.exports = (defaultConfig) => ({
  ...defaultConfig,
  foo: 'bar',
});
`);

  const config = await parseConfiguration('./file.js', {
    default: true,
  });
  expect(config).toStrictEqual({
    default: true,
    foo: 'bar',
  });
});

it('throws if the JS module could not be imported', async (): Promise<void> => {
  expect.assertions(1);

  const { parseConfiguration } = await import('./parseConfiguration.js');

  readFileSpy.mockResolvedValue('foo');

  try {
    await parseConfiguration('./invalid.js', {});
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
  }
});
