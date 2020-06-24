// temp
import { makeJwt, Jose, Payload } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { config } from '../environment.dev.ts';

/**
 * default parameters for JWT
 */

const defaultHeader: Jose = {
  alg: 'HS256',
  typ: 'JWT',
};

const defaultPayload: Payload = {
  iss: config.TOKEN_ISS as string,
  userId: 1,
  isAdmin: true,
};

const defaultKey = config.TEST_SECRET; // USED FOR TESTING TOKENS

/**
 *
 * @param {Jose} [header=defaultHeader]
 * @param {*} [payload=defaultPayload]
 * @param {string} [key=defaultKey]
 */

export const genToken = (
  key: string = defaultKey,
  header = defaultHeader,
  payload: Payload = defaultPayload
): string => {
  return makeJwt({
    header,
    payload,
    key,
  });
};

/**
 *
 * @param {string} jwt JWT token
 * @param {string} [key=secret] secret key
 *
 * simplified version of validateJwt that returns boolean.
 */
export const validateToken = async (jwt: string, key: string = defaultKey): Promise<boolean> => {
  return (await validateJwt(jwt, key)).isValid;
};

/**
 * getToken returns the token from the request headers.
 * Since requests pass through authentication middleware, no
 * undefined or null checking is required
 * @param {RouterContext} ctx
 */
export const getToken = ({ request, throw: throwError }: RouterContext): string | never => {
  const token = request.headers.get('Authorization')?.split(' ')[1] as string;

  if (!token) {
    return throwError(401, 'Missing authentication credentials');
  } else {
    return token;
  }
};

/**
 * getTokenUserId return a promise with the number or throws an error
 * validates and extracts the userId in the payload. If no userId exists,
 * the method will throw an error.
 * @param {RouterContext} ctx
 */
export const getTokenUserId = async (ctx: RouterContext<any>): Promise<number | never> => {
  const token = getToken(ctx);

  const jwt = (await validateJwt(token, config.SECRET)) as JwtObject;

  const id = jwt.payload?.userId;

  if (!id) {
    ctx.throw(401, 'User ID not found.');
  } else {
    return id as number;
  }
};
