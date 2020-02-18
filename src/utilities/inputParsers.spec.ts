import * as actionsCore from '@actions/core';

import {
  parseInputCommitAssets,
  parseInputDryRun,
  parseInputNodeModule,
  parseInputReleaseAssets,
  parseInputReleaseBranch,
} from './inputParsers';

const getInputSpy = jest.spyOn(actionsCore, 'getInput').mockImplementation();

describe('parseInputNodeModule', (): void => {
  it("returns true when the value of the npm-package input is set to 'true'", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('true');

    const result = parseInputNodeModule();

    expect(result).toStrictEqual(true);
  });
});

describe('parseInputDryRun', (): void => {
  it("returns true when the value of the dry-run input is set to 'true'", (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('true');

    const result = parseInputDryRun();

    expect(result).toStrictEqual(true);
  });
});

describe('parseInputReleaseBranch', (): void => {
  it('returns a valid branches configuration array', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue('master');

    const result = parseInputReleaseBranch();

    expect(result).toStrictEqual('master');
  });
});

describe('parseInputCommitAssets', (): void => {
  it('returns an array of valid paths relative to the project root', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(`
    ./src
    ./lib
    ./random
    `);

    const result = parseInputCommitAssets();

    expect(result).toStrictEqual(['./src']);
  });
});

describe('parseInputReleaseAssets', (): void => {
  it('returns an array of valid paths relative to the project root', (): void => {
    expect.assertions(1);

    getInputSpy.mockReturnValue(`
    ./src
    `);

    const result = parseInputReleaseAssets();

    expect(result).toStrictEqual(['./src']);
  });
});
