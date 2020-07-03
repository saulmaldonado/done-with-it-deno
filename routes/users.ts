import { Router } from '../deps.ts';
import { getAllUsers, getUserById, editUser, deleteUser } from '../controllers/users.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  // GET /api/v1/users/
  router.get(`${path}`, authenticate, getAllUsers);

  // GET /api/v1/users/:id
  router.get(`${path}/:id`, authenticate, getUserById);

  // PUT /api/v1/users/:id
  router.put(`${path}/:id`, authenticate, editUser);

  // DELETE /api/v1/users/:id
  router.delete(`${path}/:id`, authenticate, deleteUser);
};
