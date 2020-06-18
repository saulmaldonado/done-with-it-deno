import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { categories } from '../index.ts';

const getAllCategories = ({ response }: RouterContext) => {
  response.body = categories;
};

export { getAllCategories };
