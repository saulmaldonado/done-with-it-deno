import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAllCategories, addCategory, deleteCategory } from '../controllers/categories.ts';
import { authenticateAdmin } from '../middleware/isAdmin.ts';

export default (router: Router, path: string) => {
  // GET /api/v1/categories
  router.get(`${path}`, getAllCategories);

  // POST /api/v1/categories
  router.post(`${path}`, authenticateAdmin, addCategory);

  // DELETE /api/v1/categories/:id
  router.delete(`${path}/:id`, authenticateAdmin, deleteCategory);
};
