import * as actionsExec from '@actions/exec';

import { installDependencies } from './installDependencies';

const execSpy = jest.spyOn(actionsExec, 'exec').mockImplementation();

describe('installDependencies', (): void => {
  it('installs executes the install-dependencies script', async (): Promise<
    void
  > => {
    expect.assertions(1);

    await installDependencies();

    expect(execSpy).toHaveBeenCalledTimes(1);
  });
});
