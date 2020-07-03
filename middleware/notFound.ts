import { Middleware, Context } from '../deps.ts';

export const notFound: Middleware<any, Context> = (ctx) => ctx.throw(404, 'Endpoint Not Found');
