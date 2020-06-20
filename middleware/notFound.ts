import { Context } from 'https://deno.land/x/oak/mod.ts';

export const notFound = (ctx: Context<Record<string, any>>) => ctx.throw(404, 'Endpoint Not Found');
