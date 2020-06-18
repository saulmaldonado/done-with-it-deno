import { Router } from 'https://deno.land/x/oak/mod.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, () => console.log('messages works'));
  router.get(`${path}/:id`, (ctx: RouterContext) => console.log(`messages id ${ctx.params.id} `));
};
