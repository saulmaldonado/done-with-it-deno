import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAllCategories } from '../controllers/categories.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, getAllCategories);
};
