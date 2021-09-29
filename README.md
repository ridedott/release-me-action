<!-- cspell:ignore YALM -->

[![license](https://img.shields.io/github/license/ridedott/release-me-action)](https://github.com/ridedott/release-me-action/blob/master/LICENSE)
[![GitHub Actions Status](https://github.com/ridedott/release-me-action/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/ridedott/release-me-action/actions)
[![GitHub Actions Status](https://github.com/ridedott/release-me-action/workflows/Continuous%20Delivery/badge.svg?branch=master)](https://github.com/ridedott/release-me-action/actions)
[![Coveralls](https://coveralls.io/repos/github/ridedott/release-me-action/badge.svg)](https://coveralls.io/github/ridedott/release-me-action)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Release Me Action

This action uses
[Semantic Release](https://github.com/semantic-release/semantic-release) to
create a new release of the repository checked-out under `$GITHUB_WORKSPACE`,
performing the following tasks:

- analyzes commits based on the
  [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
- optionally, omits creating or updating the `CHANGELOG.md` file based on the
  analyzed commits
- optionally, bumps the NPM package version number
- optionally, commits workflow generated assets to the repository
- optionally, adds workflow generated assets to the release
- creates a GitHub release based on the analyzed commits

# Usage

```yaml
steps:
  - env:
      # Credentials used to perform the release and commit the updated assets
      # to the repository.
      # Required: true
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      # Configure Semantic Release branches parameter:
      # https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#branches-properties
      #
      # If not specified, Semantic Release will use its default branches
      # configuration, specified in the API documentation:
      # https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#branches
      release-branches: '["+([0-9])?(.{+([0-9]),x}).x","master","next","next-major",{"name":"beta","prerelease":"beta"},{"name":"alpha","prerelease":"alpha"}]',
      # Commit the new line separated glob patterns to the repository as part
      # of the release process.
      commit-assets: |
        ./dist
      # Run semantic release in dry-run mode.
      # Default: false
      dry-run: true
      # Bump the node module version and commit the changed package files to the
      # repository as part of the release process.
      # Default: false
      node-module: true
      # Attach the new line separated listed glob patterns to the release.
      release-assets: |
        ./generated/my-asset.tar.gz
      # Do not generate CHANGELOG.md file
      # Default: false
      disable-changelog: true
      # Configure the semantic release commit analyzer rules that are used to
      # determine the correct release version.
      # https://www.npmjs.com/package/@semantic-release/commit-analyzer#releaserules
      release-rules:
        '[{ "release": "patch", "type": "build" }, { "release": "patch", "type":
        "chore(deps)" }, { "release": "patch", "type": "chore(deps-dev)" }]'
      # Append additional semantic release commit analyzer rules to the default set of rules already included in the action.
      # Default rules:
      # [
      #  { "release": "patch", "type": "build" },
      #  { "release": "patch", "type": "chore" },
      #  { "release": "patch", "type": "ci" },
      #  { "release": "patch", "type": "docs" },
      #  { "release": "patch", "type": "improvement" },
      #  { "release": "patch", "type": "refactor" },
      #  { "release": false, "subject": "*\\[skip release\\]*" },
      # ]
      # Note: these do not override the default rules. You cannot configure 'release-rules' if you wish to append rules.
      release-rules-append:
        '[{"release":false,"subject":"*\\[skip release\\]*"}]'
      # Loads a custom Semantic Release configuration from this file. See
      # https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file.
      # Provided configuration will be shallow merged with defaults. Supported
      # formats are YALM or CommonJS.
      config-file: ./path/to/config.yaml
      # Specify additional semantic-release plugins to install. Accepts packages
      # in typical package.json format.
      additional-plugins:
        '{ "@google/semantic-release-replace-plugin": "^4.0.2" }'
```

**IMPORTANT** `GITHUB_TOKEN` does not have the required permissions to operate
on protected branches. If you are using this action to release to a protected
branch, replace the `GITHUB_TOKEN` with a
[GitHub Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
with the required permissions enabled on it.

# Scenarios

- [Create a release](#create-a-release)
- [Create a release without a CHANGELOG.md file](#create-a-release-without-a-changelog-file)
- [Test a release](#test-a-release)
- [Create a release to a different branch](#create-a-release-to-a-different-branch)
- [Create a release and update repository contents](#create-a-release-and-update-repository-contents)
- [Create a release with attached artifacts](#create-a-release-with-attached-artifacts)
- [Create a release updating an npm package version](#create-a-release-updating-an-npm-package-version)
- [Create a release on a protected branch](#create-a-release-on-a-protected-branch)
- [Create a release of a node module and publish it to multiple registries](#create-a-release-of-a-node-module-and-publish-it-to-multiple-registries)

## Create a release

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
```

## Create a release without a CHANGELOG file

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      disable-changelog: true
```

## Output release details

Output parameters supported:

- version: Released version in format of X.Y.Z (major.minor.patch).
- level: Released level (major, minor or patch).
- released: Release status (boolean string).

```yaml
steps:
  - name: Release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    uses: ridedott/release-me-action@master
  - name: Output
        if: steps.build_package.outputs.released == 'true'
        run: |
          echo released version: ${{ steps.build_package.outputs.version }}, type: ${{ steps.build_package.outputs.level }}
```

## Test a release

Runs semantic release in dry-run mode on a branch different to master, omitting
to commit any assets or perform the actual release.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      dry-run: true
      release-branches: '["my-branch"]'
```

## Create a release to a different branch

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      release-branches: '["releases"]'
```

## Create a pre-release release to a channel (e.g. "beta")

For pre-releases it is recommended to create a separate workflow: (e.g.
continuous-delivery-beta.yaml) which will run only on `beta` branch:

```yaml
on:
  push:
    branches:
      - beta

steps:
  - name: Beta release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    uses: ridedott/release-me-action@master
    with:
      release-branches: '[{"name":"beta","prerelease":"beta"}]',
  - name: Setup Node.js
    uses: actions/setup-node@v1
    with:
      registry-url: "https://npm.pkg.github.com"
  - name: Publish to GitHub Packages
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN_WORKAROUND }}
    run: |
      npm publish --tag=beta
```

## Create a release and update repository contents

Commit the listed glob patterns to the repository as part of the release
process.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      commit-assets: |
        ./dist
        ./public
```

## Create a release with attached artifacts

Attach the listed glob patterns to the release.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      release-assets: |
        ./generated/my-asset.tar.gz
```

## Create a release updating an npm package version

This configuration also updates `package.json` and `package-lock.json` or
`yarn-lock.yaml` files alongside `CHANGELOG.md`.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      node-module: true
```

## Create a release on a protected branch

This configuration uses a
[GitHub Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
to authenticate to GitHub.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_PERSONAL_ACCESS_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
```

## Create a release of a node module and publish it to multiple registries

This configuration showcases how to complement the release with publishing steps
for multiple package registries.

```yaml
steps:
  - env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Release
    uses: ridedott/release-me-action@master
    with:
      node-module: true
  - name: Setup Node.js
    uses: actions/setup-node@v1
    with:
      registry-url: 'https://npm.pkg.github.com'
  - env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    name: Publish to GitHub Packages
    run: npm publish
  - name: Setup Node.js
    uses: actions/setup-node@v1
    with:
      registry-url: 'https://registry.npm.org'
      # Scoped packages require the scope parameter to be set in the setup
      # node step when publishing to the npm registry.
      scope: '@my-organization'
  - env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
    name: Publish to npm
    run: npm publish
```
