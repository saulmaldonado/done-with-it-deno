import { Router } from 'https://deno.land/x/oak/mod.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, () => console.log(`${path}/ works!`));
  router.get(`${path}/:id`, (ctx) => console.log(`${path}${ctx.params.id} works!`));
};
