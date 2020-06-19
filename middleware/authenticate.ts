import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { Middleware } from 'https://deno.land/x/oak/middleware.ts';

const secret = 'secret';

export const authenticate: Middleware<any, RouterContext<any>> = async (ctx, next) => {
  const token = ctx.request.headers.get('Authorization');
  if (!token) {
    ctx.throw(401, 'Missing authentication credentials');
  } else {
    const jwt = token.split(' ')[1];

    const result = await validateJwt(jwt, secret);

    if (result.isValid) {
      await next();
    } else if (result.isExpired) {
      ctx.throw(401, 'Token is expired');
    } else {
      ctx.throw(401, 'Invalid Token');
    }
  }
};
