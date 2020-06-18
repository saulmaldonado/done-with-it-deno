import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Category } from '../schema.ts';

export const categories: Category[] = (await readJson('./db/categories.json')) as Category[];
const baseUrl = 'http://localhost:8000';

Deno.test('/api/v1/categories should return all categories', async () => {
  const result = await fetch(baseUrl + '/api/v1/categories');
  assert(result.ok);

  const resultCategories = (await result.json()) as Category[];
  assertEquals(resultCategories.length, categories.length);
});
