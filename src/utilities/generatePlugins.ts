import { PluginSpec } from 'semantic-release';

export const generatePlugins = ({
  commitAssets,
  isNodeModule,
  releaseAssets,
}: {
  commitAssets: string[];
  isNodeModule: boolean;
  releaseAssets: string[];
}): PluginSpec[] => {
  return [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npx prettier --write CHANGELOG.md',
      },
    ],
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
          './CHANGELOG.md',
          ...commitAssets,
          ...(isNodeModule
            ? ['./package.json', './package-lock.json', './yarn-lock.yaml']
            : []),
        ],
        // eslint-disable-next-line no-template-curly-in-string
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
  ];
};
