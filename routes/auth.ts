import { Router } from 'https://deno.land/x/oak/mod.ts';
import { register } from '../controllers/auth.ts';

export default (router: Router, path: string) => {
  router.post(`${path}/login`, (ctx) => {
    ctx.response.body = 'login';
  });

  router.post(`${path}/register`, register);

  router.put(`${path}/logout`, (ctx) => {
    ctx.response.body = 'logout';
  });
};
