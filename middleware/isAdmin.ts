import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { Middleware } from 'https://deno.land/x/oak/middleware.ts';
import { getToken } from '../helpers/jwtAuth.ts';

const secret = 'secret';

export const authenticateAdmin: Middleware<any, RouterContext<any>> = async (ctx, next) => {
  const jwt = getToken(ctx);

  const result = await validateJwt(jwt, secret);

  if (result.isValid) {
    if (result.payload?.isAdmin) {
      await next();
    } else {
      ctx.throw(403, 'Unauthorized to access endpoint');
    }
  } else if (result.isExpired) {
    ctx.throw(401, 'Token is expired');
  } else {
    ctx.throw(401, 'Invalid Token');
  }
};
