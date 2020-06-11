import { setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  Level = 'level',
  Major = 'major',
  Meta = 'meta',
  Minor = 'minor',
  Patch = 'patch',
  PreRelease = 'prerelease',
  Released = 'released',
  Version = 'version',
}

interface SemVerGroups {
  major: string;
  meta?: string;
  minor: string;
  patch: string;
  prerelease?: string;
}

// eslint-disable-next-line max-statements
export const reportResults = (result: Result): void => {
  if (result === false) {
    setOutput(OutputParameters.Released, 'false');

    return;
  }

  const { nextRelease } = result;

  // eslint-disable-next-line unicorn/no-unsafe-regex
  const semVerRegExp = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<meta>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gmu;

  const { groups } = semVerRegExp.exec(nextRelease.version) as RegExpExecArray;

  const {
    major,
    meta,
    minor,
    patch,
    prerelease,
  } = (groups as unknown) as SemVerGroups;

  setOutput(OutputParameters.Major, major);

  if (meta !== undefined) {
    setOutput(OutputParameters.Meta, meta);
  }

  setOutput(OutputParameters.Minor, minor);
  setOutput(OutputParameters.Patch, patch);

  if (prerelease !== undefined) {
    setOutput(OutputParameters.PreRelease, prerelease);
  }

  setOutput(OutputParameters.Released, 'true');
  setOutput(OutputParameters.Version, nextRelease.version);
  setOutput(OutputParameters.Level, nextRelease.type);
};
