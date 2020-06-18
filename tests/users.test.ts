import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { User } from '../schema.ts';

const usersDb = (await readJson('./db/users.json')) as User[];

const baseUrl = 'http://localhost:8000';

Deno.test('/api/v1/users should return all users', async () => {
  const result = await fetch(baseUrl + '/api/v1/users');

  const body = (await result.json()) as User[];

  assert(result.ok);
  assertEquals(body.length, usersDb.length);
});

Deno.test('/api/v1/users/:id should return a user with the matching id', async () => {
  const result = await fetch(baseUrl + '/api/v1/users/1');
  const body = (await result.json()) as User;

  assert(result.ok);
  assertEquals(body.id, 1);
});

Deno.test('request for invalid user id should fail', async () => {
  const { ok, body, status } = await fetch(baseUrl + '/api/v1/users/0');

  assertEquals(ok, false);
  assertEquals(status, 404);

  await body?.cancel();
});