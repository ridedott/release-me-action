/* eslint-disable functional/immutable-data */
/* eslint-disable unicorn/prevent-abbreviations */
import environmentCi from 'env-ci';

module.exports = ({
  cwd,
  env,
}: {
  cwd: string;
  env: { [key: string]: string };
}): { [key: string]: unknown } => {
  const { isCi, ...other } = environmentCi({ cwd, env });

  return { isCi: false, isPr: false, ...other };
};
