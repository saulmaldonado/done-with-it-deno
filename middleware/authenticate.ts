import { validateJwt } from '../deps.ts';
import { RouterContext } from '../deps.ts';
import { Middleware } from '../deps.ts';
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
