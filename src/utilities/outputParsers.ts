import { setOutput } from '@actions/core';
import { Result } from 'semantic-release';

enum OutputParameters {
  Build = 'build',
  Level = 'level',
  Major = 'major',
  Minor = 'minor',
  Patch = 'patch',
  PreRelease = 'pre-release',
  Released = 'released',
  Version = 'version',
}

interface SemVerComponents {
  build?: string;
  major: string;
  minor: string;
  patch: string;
  preRelease?: string;
}

const extractVersionComponents = (version: string): SemVerComponents => {
  /* eslint-disable-next-line capitalized-comments */
  // prettier-ignore
  /* eslint-disable-next-line unicorn/no-unsafe-regex */
  const semVerRegExp = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<preRelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gmu;

  const { groups } = semVerRegExp.exec(version) as RegExpExecArray;

  return groups as unknown as SemVerComponents;
};

export const reportResults = (result: Result): void => {
  if (result === false) {
    setOutput(OutputParameters.Released, 'false');

    return;
  }

  const { nextRelease } = result;

  const { build, major, minor, patch, preRelease } = extractVersionComponents(
    nextRelease.version,
  );

  if (build !== undefined) {
    setOutput(OutputParameters.Build, build);
  }

  setOutput(OutputParameters.Level, nextRelease.type);

  setOutput(OutputParameters.Major, major);
  setOutput(OutputParameters.Minor, minor);
  setOutput(OutputParameters.Patch, patch);

  if (preRelease !== undefined) {
    setOutput(OutputParameters.PreRelease, preRelease);
  }

  setOutput(OutputParameters.Released, 'true');
  setOutput(OutputParameters.Version, nextRelease.version);
};
