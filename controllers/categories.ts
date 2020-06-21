import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { categories } from '../index.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { Category } from '../schema.ts';

const readCategories = async () => (await readJson('./db/categories.json')) as Category[];

const writeCategories = async (newCategories: Category[]) =>
  await writeFileStr('./db/categories.json', JSON.stringify(newCategories));

const getAllCategories = async ({ response }: RouterContext) => {
  response.body = await readCategories();
};

const addCategory = async ({ request, response }: RouterContext) => {
  const dbCategories = await readCategories();

  let newCategory = (await request.body({ contentTypes: { json: ['text'] } })).value as Category;

  const newIndex = dbCategories.length + 1;

  newCategory = { ...newCategory, id: newIndex };

  dbCategories.push(newCategory);
  await writeCategories(dbCategories);

  response.body = newCategory;
};

type DeleteCategoryParams = {
  id: string;
};

const deleteCategory = async (ctx: RouterContext<DeleteCategoryParams>) => {
  const dbCategories = await readCategories();
  const categoryId = Number(ctx.params.id);

  const categoryIndex = dbCategories.findIndex((c) => c.id === categoryId);

  if (categoryIndex < 0) {
    ctx.throw(404, 'Category does not exist.');
  }

  dbCategories.splice(categoryIndex, 1);

  await writeCategories(dbCategories);

  ctx.response.body = 'Category deleted';
};

export { getAllCategories, addCategory, deleteCategory };
