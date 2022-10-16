import { getAuth } from 'firebase-admin/auth';
import { Service } from 'typedi';
import { hashAlgorithm } from '../../../common';
import ImportUserAction from '../dto/action/import-user.action';

@Service()
export default class AuthAdapter {

  private readonly auth = getAuth();

  public async importUser(action: ImportUserAction): Promise<void> {
    const result = await this.auth.importUsers(
      [action],
      { hash: { algorithm: hashAlgorithm } }
    );
    
    if (result.failureCount > 0) {
      throw result.errors[0].error;
    }
  }
}
