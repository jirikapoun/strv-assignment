import { HttpError } from 'routing-controllers';

export default class NotImplementedError extends HttpError {

  public constructor() {
    super(501, 'This feature is not implemented yet');
  }
}
