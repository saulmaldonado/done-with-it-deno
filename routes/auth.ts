import { Router, RouterContext } from '../deps.ts';
import { register, login, logout, newToken, checkForEmail } from '../controllers/auth.ts';
import { authenticateAdmin } from '../middleware/isAdmin.ts';

export default (router: Router, path: string) => {
  // POST api/v1/auth/login {email, password}
  router.post(`${path}/login`, login);

  // POST api/v1/auth/register {email, password, name}
  router.post(`${path}/register`, register);

  //POST api/v1/auth/logout {refreshToken}
  router.post(`${path}/logout`, logout);

  //POST /api/v1/auth/refresh {refreshToken}
  router.post(`${path}/refresh`, newToken);

  // POST /api/v1/auth/email {email}
  router.post(`${path}/email`, checkForEmail);

  //GET /api/v1/auth/admin FOR TESTING
  router.get(`${path}/admin`, authenticateAdmin, (ctx: RouterContext) => {
    ctx.response.body = 'You are admin!';
  });
};
