import { RouterContext } from '../deps.ts';
import { AddCategoryBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { validateBody } from '../schemas/validate.ts';
import { AddCategoryBody } from '../schemas/bodySchema.ts';
import {
  readCategories,
  writeCategories,
  readListings,
  writeListings,
} from '../helpers/database.ts';

const getAllCategories = async ({ response }: RouterContext) => {
  response.body = await readCategories();
};

const addCategory = async (ctx: RouterContext) => {
  const dbCategories = await readCategories();

  const body = await validateBody<AddCategoryBody>(ctx, AddCategoryBodyGuard);

  const newIndex = dbCategories.length + 1;

  const newCategory = { ...body, id: newIndex };

  dbCategories.push(newCategory);
  await writeCategories(dbCategories);

  ctx.response.body = newCategory;
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

  const listings = await readListings();
  let newListings = listings.filter((l) => l.categoryId !== categoryId);

  await writeListings(newListings);

  ctx.response.body = 'Category deleted';
};

export { getAllCategories, addCategory, deleteCategory };
