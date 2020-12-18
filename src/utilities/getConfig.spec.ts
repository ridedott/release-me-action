import { promises as fs } from 'fs';

import { getConfig } from './getConfig';

const readFileSpy = jest.spyOn(fs, 'readFile');

it('returns an object from a specified YAML file', async (): Promise<void> => {
  expect.assertions(2);

  readFileSpy.mockResolvedValue('{foo: true}');

  const config = await getConfig('./dir/config.yml', {});

  expect(config).toStrictEqual({ foo: true });
  expect(readFileSpy.mock.calls[0][0]).toStrictEqual('./dir/config.yml');
});

it('throws if the YAML file is not parsed to an object', async (): Promise<void> => {
  expect.assertions(1);

  readFileSpy.mockResolvedValue('foo');

  try {
    await getConfig('./dir/config.yml', {});
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
  }
});

it('returns an object from a specified JS file', async (): Promise<void> => {
  expect.assertions(1);

  readFileSpy.mockResolvedValue(`
module.exports = (defaultConfig) => ({
  ...defaultConfig,
  foo: 'bar',
});
`);

  const config = await getConfig('./file.js', {
    default: true,
  });
  expect(config).toStrictEqual({
    default: true,
    foo: 'bar',
  });
});

it('throws if the JS module could not be imported', async (): Promise<void> => {
  expect.assertions(1);

  readFileSpy.mockResolvedValue('foo');

  try {
    await getConfig('./invalid.js', {});
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
  }
});
