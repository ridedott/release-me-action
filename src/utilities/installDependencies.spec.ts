import { jest } from '@jest/globals';

const execSpy = jest.fn() as unknown as jest.SpiedFunction<
  (_: never, packages: string[]) => unknown
>;

jest.unstable_mockModule('@actions/exec', (): unknown => ({
  exec: execSpy,
}));

describe('installDependencies', (): void => {
  it('executes the install-dependencies script', async (): Promise<void> => {
    expect.assertions(1);

    const { installDependencies } = await import('./installDependencies.js');

    await installDependencies();

    expect(execSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the install-dependencies script with additional packages', async (): Promise<void> => {
    expect.assertions(1);

    const { installDependencies } = await import('./installDependencies.js');

    await installDependencies({
      '@semantic-release/git': '^4.0.2',
      '@semantic-release/test': '^5.0.2',
    });

    expect(execSpy.mock.calls[0][1].slice(1)).toMatchInlineSnapshot(`
[
  "@semantic-release/git@^4.0.2",
  "@semantic-release/test@^5.0.2",
]
`);
  });
});
