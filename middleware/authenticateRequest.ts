import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { makeJwt, Jose, Payload } from 'https://deno.land/x/djwt/create.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

const secret = 'secret';

const authenticateRequest = async (ctx: RouterContext, next: Promise<void>) => {
  const token = ctx.request.headers.get('Authorization');
  if (!token) {
    throw new Error('Missing authentication credentials');
  }

  const jwt = token.split(' ')[1];

  const result = await validateJwt(jwt, secret);

  if (result.isValid) {
    return result.payload;
  } else if (result.isExpired) {
    throw new Error('Token is expired');
  } else {
    throw new Error('Invalid Token');
  }
};
