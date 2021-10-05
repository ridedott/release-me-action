import { PluginSpec } from 'semantic-release';

import { ReleaseRule } from './inputProcessors';
import { transform } from './transform';

/* eslint-disable-next-line max-lines-per-function */
export const generatePlugins = ({
  commitAssets,
  disableChangeLog = false,
  isNodeModule,
  releaseAssets,
  releaseRules,
}: {
  commitAssets: string[];
  disableChangeLog?: boolean;
  isNodeModule: boolean;
  releaseAssets: string[];
  releaseRules: ReleaseRule[];
}): PluginSpec[] => 
  /* eslint-disable unicorn/prevent-abbreviations */
   [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          mergeCorrespondence: ['id', 'source'],
          mergePattern: /^Merge pull request #\d+ from .*$/u,
        },
        preset: 'angular',
        releaseRules,
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        writerOpts: {
          transform,
        },
      },
    ],
    ...(disableChangeLog === false
      ? [
          '@semantic-release/changelog',
          [
            '@semantic-release/exec',
            {
              prepareCmd: 'npx prettier --parser markdown --write CHANGELOG.md',
            },
          ] as PluginSpec,
        ]
      : []),
    ...(isNodeModule === true
      ? [
          [
            '@semantic-release/npm',
            {
              npmPublish: false,
            },
          ] as PluginSpec,
        ]
      : []),
    [
      '@semantic-release/git',
      {
        assets: [
          ...(disableChangeLog === false ? ['./CHANGELOG.md'] : []),
          ...commitAssets,
          ...(isNodeModule
            ? ['./package.json', './package-lock.json', './yarn-lock.yaml']
            : []),
        ],
        /* eslint-disable-next-line no-template-curly-in-string */
        message: 'chore(release): v${nextRelease.version}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: releaseAssets,
        failComment: false,
        releasedLabels: false,
        successComment: false,
      },
    ],
  ]
  /* eslint-enable unicorn/prevent-abbreviations */
;
