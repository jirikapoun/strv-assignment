export default class UndefinedValueError extends Error {

  public meta: unknown[];

  public constructor(message: string, ...meta: unknown[]) {
    super(message);
    this.meta = meta;
  }
}
