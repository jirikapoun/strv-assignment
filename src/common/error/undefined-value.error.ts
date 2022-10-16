import { InternalServerError } from 'routing-controllers';

export default class UndefinedValueError extends InternalServerError {

  public meta: unknown[];

  public constructor(message: string, ...meta: unknown[]) {
    super(message);
    this.meta = meta;
  }
}
