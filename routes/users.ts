import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAllUsers, getUserById } from '../controllers/users.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, getAllUsers);
  router.get(`${path}/:id`, getUserById);
};
