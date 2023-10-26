import * as envCi from 'env-ci';

module.exports = ({
  cwd,
  env,
}: {
  cwd: string;
  env: string;
}): { [key: string]: unknown } => {
  const { isCi, isPr, ...other } = envCi({ cwd, env });

  return { isCi: false, isPr: false, ...other };
};
