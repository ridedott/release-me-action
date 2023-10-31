import signale from 'signale';

class Signale extends signale.Signale {
  /* eslint-disable @typescript-eslint/naming-convention */
  public _log(): void {}

  public _logger(): void {}

  public _write(): void {}
  /* eslint-enable @typescript-eslint/naming-convention */
}

export { Signale };
