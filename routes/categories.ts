import { Router } from 'https://deno.land/x/oak/mod.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, () => console.log('categories works!'));
};
