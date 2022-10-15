import { BadRequestError } from 'routing-controllers';

export default class DuplicateEmailError extends BadRequestError {
  
  name = 'DuplicateEmailError';

  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}
