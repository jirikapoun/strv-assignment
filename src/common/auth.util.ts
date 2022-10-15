import { genSaltSync, hashSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';
import { logger } from './log.util';

export function hashPassword(password: string): string {
  const salt = genSaltSync();
  return hashSync(password, salt);
}

export function generateToken(subject: string) {
  return sign(
    { sub: subject },
    'TODO',
    { expiresIn: '1h' }
  )
}

const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

export function authorizationChecker<User>(findUser: (userId: string) => Promise<User | undefined>): AuthorizationChecker {
  return async (action) => {
    const token = extractToken(action.request);
    if (!token) {
      return false;
    }

    return await new Promise(resolve =>
      verify(token, 'TODO', async (error, decoded) => {
        if (error) {
          logger.debug('Authentication unsuccessful', error);
          return resolve(false);
        }

        const userId = decoded?.sub;
        if (!userId) {
          logger.warning('Authentication failed, token subject is not defined', decoded);
          return resolve(false);
        }

        const user = await findUser(typeof userId === 'string' ? userId : userId());
        if (!user) {
          logger.warning('Authentication failed, user not found', decoded);
          return resolve(false);
        }

        action.request.user = user;
        return resolve(true);
      })
    );
  };
}
