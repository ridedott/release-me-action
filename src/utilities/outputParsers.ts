/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

interface SemVersionComponents {
  build?: string;
  major: string;
  minor: string;
  patch: string;
  preRelease?: string;
}

const extractVersionComponents = (version: string): SemVersionComponents => {
  /* eslint-disable-next-line unicorn/no-unsafe-regex */
  const semVersionRegExp = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<preRelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<build>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gmu;

  const { groups } = semVersionRegExp.exec(version)!;

  return (groups as unknown) as SemVersionComponents;
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
