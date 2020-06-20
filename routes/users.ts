import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
} from "../controllers/users.ts";
import { authenticate } from "../middleware/authenticate.ts";
export default (router: Router, path: string) => {
  // GET /api/v1/users/
  router.get(`${path}`, authenticate, getAllUsers);

  router.get(`${path}/:id`, authenticate, getUserById);

  router.put(`${path}/:id`, authenticate, editUser);

  router.delete(`${path}/:id`, authenticate, deleteUser);
};
