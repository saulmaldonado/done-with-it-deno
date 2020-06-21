import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { Category } from '../schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';

export const categories: Category[] = (await readJson('./db/categories.json')) as Category[];
const baseUrl = 'http://localhost:8000';

const readCategories = async () => (await readJson('./db/categories.json')) as Category[];

const writeCategories = async (newCategories: Category[]) =>
  await writeFileStr('./db/categories.json', JSON.stringify(newCategories));

Deno.test('/api/v1/categories should return all categories', async () => {
  const result = await fetch(baseUrl + '/api/v1/categories');
  assert(result.ok);

  const resultCategories = (await result.json()) as Category[];
  assertEquals(resultCategories.length, categories.length);
});

Deno.test('POST /api/v1/categories should add new category to database', async () => {
  const testToken = genToken();
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
  const testToken = genToken();
  const initialState = await readCategories();

  const idToDelete = 9;

  const result = await fetch(baseUrl + `/api/v1/categories/${idToDelete}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  const body = await result.text();
  console.log(body);

  assert(result.ok);

  const dbCategories = await readCategories();
  assert(!dbCategories.some((c) => c.id === idToDelete));

  //cleanup

  await writeCategories(initialState);
  // result.body?.cancel();
});
