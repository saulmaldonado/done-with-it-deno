import { Router } from 'https://deno.land/x/oak/mod.ts';
import { register, login, logout, newToken } from '../controllers/auth.ts';

export default (router: Router, path: string) => {
  // POST api/v1/login {email, password}
  router.post(`${path}/login`, login);

  // POST api/v1/register {email, password, name}
  router.post(`${path}/register`, register);

  //POSE api/v1/logout {refreshToken}
  router.post(`${path}/logout`, logout);

  //POSE /api/v1/refresh {refreshToken}
  router.post(`${path}/refresh`, newToken);
};
