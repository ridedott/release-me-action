import { generatePlugins } from './generatePlugins';

describe('generatePlugins', (): void => {
  it('excludes the changelog plugin when called with the disableGenerateChangelog parameter set to true', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        disableGenerateChangeLog: true,
        isNodeModule: false,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('excludes the npm plugin when called with the isNodeModule parameter set to false', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        isNodeModule: false,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('configures the git plugin to omit committing the updated package files when isNodeModule is set to false', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        isNodeModule: false,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('configures the npm plugin to bump the package versions when the isNodeModule parameter is set to true', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        isNodeModule: true,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('configures the git plugin to commit the updated package files when the isNodeModule parameter is set to true', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        isNodeModule: true,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('configures the git plugin to commit the specified assets as part of the release process', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: ['./src'],
        isNodeModule: false,
        releaseAssets: [],
      }),
    ).toMatchSnapshot();
  });

  it('configures the github plugin to release the specified assets as part of the release process', (): void => {
    expect.assertions(1);

    expect(
      generatePlugins({
        commitAssets: [],
        isNodeModule: false,
        releaseAssets: ['./src'],
      }),
    ).toMatchSnapshot();
  });
});
