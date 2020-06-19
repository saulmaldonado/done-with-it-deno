import { Router } from 'https://deno.land/x/oak/mod.ts';

export default (router: Router, path: string) => {
  router.post(`${path}/login`, (ctx) => {
    ctx.response.body = 'login';
  });

  router.post(`${path}/login`, (ctx) => {
    ctx.response.body = 'register';
  });

  router.post(`${path}/logout`, (ctx) => {
    ctx.response.body = 'logout';
  });
};
