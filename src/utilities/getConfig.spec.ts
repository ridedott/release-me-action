import { promises as fs } from 'fs';

import { getConfig } from './getConfig';

const readFileSpy = jest.spyOn(fs, 'readFile');

it('returns an object from a specified YAML file', async (): Promise<void> => {
  expect.assertions(2);

  readFileSpy.mockResolvedValue('{foo: true}');

  const config = await getConfig('/root/', '/dir');

  expect(config).toStrictEqual({ foo: true });
  expect(readFileSpy.mock.calls[0][0]).toStrictEqual('/root/dir');
});

it('throws if the YAML file is not parsed to an object', async (): Promise<
  void
> => {
  expect.assertions(1);

  readFileSpy.mockResolvedValue('foo');

  try {
    await getConfig('/root/', '/dir');
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
  }
});
