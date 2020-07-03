import { Context, send, Middleware } from '../deps.ts';

export const serverStatic: Middleware<any, Context> = async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith('/assets')) {
    try {
      const result = await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd().replace(/\\/g, '/')}/public`,
      });
      if (!result) {
        throw Error;
      }
    } catch {
      ctx.throw(400, 'Invalid static path');
    }
  } else {
    await next();
  }
};
