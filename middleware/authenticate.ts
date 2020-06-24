import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { Middleware } from 'https://deno.land/x/oak/middleware.ts';
import { getToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';

const secret = config.SECRET;

export const authenticate: Middleware<any, RouterContext<any>> = async (ctx, next) => {
  const jwt = getToken(ctx);

  const result = await validateJwt(jwt, secret);

  if (result.isValid) {
    await next();
  } else if (result.isExpired) {
    ctx.throw(401, 'Token is expired');
  } else {
    ctx.throw(401, 'Invalid Token');
  }
};
