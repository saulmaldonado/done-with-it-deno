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

  let newCategory = (await (await request.body({ contentTypes: { json: ['text'] } }))
    .value) as Category;

  const newIndex = dbCategories.length + 1;

  newCategory = { ...newCategory, id: newIndex };

  dbCategories.push(newCategory);
  await writeCategories(dbCategories);

  response.body = newCategory;
};

export { getAllCategories, addCategory };
