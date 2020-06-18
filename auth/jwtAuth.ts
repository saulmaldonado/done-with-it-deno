// temp
import { makeJwt, Jose } from 'https://deno.land/x/djwt/create.ts';

/**
 * default parameters for JWT
 */

const defaultHeader: Jose = {
  alg: 'HS256',
  typ: 'JWT',
};

const defaultPayload = {
  iss: 'donewithit',
  userid: 1,
};

const defaultKey = 'secret';

/**
 * function passes in parameters into makeJwt method. If no parameters
 * are provided, default values are passed in. Default default will be used for test
 */

export default (
  header = defaultHeader,
  payload: { [key: string]: string | number } = defaultPayload,
  key: string = defaultKey
): string => {
  return makeJwt({
    header,
    payload,
    key,
  });
};
