// temp
import { makeJwt, Jose, Payload } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

/**
 * default parameters for JWT
 */

const defaultHeader: Jose = {
  alg: 'HS256',
  typ: 'JWT',
};

const defaultPayload: Payload = {
  iss: 'donewithit',
  userid: 1,
};

const defaultKey = 'secret';

/**
 *
 * @param {Jose} [header=defaultHeader]
 * @param {*} [payload=defaultPayload]
 * @param {string} [key=defaultKey]
 */

export const genToken = (
  header = defaultHeader,
  payload: Payload = defaultPayload,
  key: string = defaultKey
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
 */
export const validateToken = async (jwt: string, key: string = defaultKey): Promise<boolean> => {
  return (await validateJwt(jwt, key)).isValid;
};
