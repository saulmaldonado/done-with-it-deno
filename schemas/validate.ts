import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { guard } from './bodyTypeGuard.ts';

export const validateBody = async <T>(ctx: RouterContext, typeGuard: guard<any>): Promise<T> => {
  const body = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  if (!typeGuard(body)) {
    ctx.throw(400, 'Invalid Type');
  }
  return body;
};
