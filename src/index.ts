import { setFailed } from '@actions/core';

import { release } from './release.js';
import { getSetFailedErrorString } from './utilities/error.js';
import { reportResults } from './utilities/outputParsers.js';

try {
  const result = await release();

  reportResults(result);
} catch (error: unknown) {
  const finalErrorString = getSetFailedErrorString(error);

  setFailed(JSON.stringify(finalErrorString));
}
