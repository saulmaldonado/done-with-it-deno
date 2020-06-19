import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { User } from '../schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';

let usersDb = (await readJson('./db/users.json')) as User[];

const baseUrl = 'http://localhost:8000';
const testToken = genToken();

Deno.test('/api/v1/users should return all users', async () => {
  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  const body = (await result.json()) as User[];

  assert(result.ok);
  usersDb = (await readJson('./db/users.json')) as User[];
  assertEquals(body.length, usersDb.length);
});

Deno.test('/api/v1/users/:id should return a user with the matching id', async () => {
  const result = await fetch(baseUrl + '/api/v1/users/1', {
    headers: { Authorization: `Bearer ${testToken}` },
  });
  const user = (await result.json()) as User;

  assert(result.ok);
  assertEquals(user.id, 1);
});

Deno.test('request for invalid user id should fail', async () => {
  const { ok, body, status } = await fetch(baseUrl + '/api/v1/users/0', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  assertEquals(ok, false);
  assertEquals(status, 404);

  await body?.cancel();
});

Deno.test(
  'Requests for users with different id from JWT payload should return not return user credentials',
  async () => {
    // payload {userId: 0}
    const testToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOjB9.sQa95AnlUJ8XrMUEFx4ys_BCPKp1CyhaTYZKOBTJSeQ';

    const result = await fetch(baseUrl + '/api/v1/users/1', {
      headers: { Authorization: `Bearer ${testToken}` },
    });

    const user = (await result.json()) as Partial<User>;

    assert(!user.email);
    assert(!user.password);
  }
);
