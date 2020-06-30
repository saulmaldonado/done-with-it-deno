import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Category } from '../schemas/schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';
import {
  readCategories,
  writeCategories,
  readListings,
  writeListings,
} from '../helpers/database.ts';

const baseUrl: string = config.BASE_URL;

export const categories: Category[] = (await readJson('./db/categories.json')) as Category[];

Deno.test('/api/v1/categories should return all categories', async () => {
  const result = await fetch(baseUrl + '/api/v1/categories');
  assert(result.ok);

  const resultCategories = (await result.json()) as Category[];
  assertEquals(resultCategories.length, categories.length);
});

Deno.test('POST /api/v1/categories should add new category to database', async () => {
  const testToken = genToken(config.SECRET);
  const initialState = await readCategories();
  const newCategory = {
    name: 'Music',
    icon: 'music',
    backgroundColor: '#778ca3',
    color: 'white',
  };
  const newCategoryId = initialState.length + 1;

  const result = await fetch(baseUrl + '/api/v1/categories', {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(newCategory),
    method: 'POST',
  });

  assert(result.ok);

  const dbCategories = await readCategories();

  assertEquals(
    dbCategories.find((c) => c.id === newCategoryId),
    { ...newCategory, id: newCategoryId }
  );

  // cleanup
  await writeCategories(initialState);
  result.body?.cancel();
});

Deno.test('DELETE /api/v1/categories/:id should delete category from database', async () => {
  const testToken = genToken(config.SECRET);
  const initialCategories = await readCategories();
  const initialListings = await readListings();

  const idToDelete = 9;

  const result = await fetch(baseUrl + `/api/v1/categories/${idToDelete}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  const body = await result.text();

  assert(result.ok);

  const dbCategories = await readCategories();
  const dbListings = await readListings();
  assert(!dbCategories.some((c) => c.id === idToDelete));
  assert(!dbListings.some((l) => l.categoryId === idToDelete));

  //cleanup

  await writeCategories(initialCategories);
  await writeListings(initialListings);
  // result.body?.cancel();
});
