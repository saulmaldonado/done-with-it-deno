import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { User } from '../schemas/schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import users from '../routes/users.ts';

let usersDb = (await readJson('./db/users.json')) as User[];

const baseUrl = 'http://localhost:8000';
const testToken = genToken();

const writeUsers = async (newUsers: User[]) => {
  await writeFileStr('./db/users.json', JSON.stringify(newUsers));
};

const readUsers = async () => {
  return (await readJson('./db/users.json')) as User[];
};

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

Deno.test('PUT /api/v1/users/:id should edit user information in the database', async () => {
  const testToken = genToken();

  const initialState = await readUsers();

  const editedUser = {
    id: 1,
    name: 'Saul',
    email: 'saul@domain.com',
    password: '12345',
  };

  const result = await fetch(baseUrl + `/api/v1/users/${editedUser.id}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(editedUser),
    method: 'PUT',
  });

  const dbUsers = await readUsers();

  const userRes = (await result.json()) as User;

  assertEquals(
    dbUsers.find((u) => u.id === userRes.id),
    userRes
  );

  // cleanup

  await writeUsers(initialState);
});

Deno.test('DELETE /api/v1/users/:id should delete user with the same id', async () => {
  const testToken = genToken();

  const initialState = await readUsers();
  const userToDelete = 1;

  const result = await fetch(baseUrl + `/api/v1/users/${userToDelete}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  assert(result.ok);

  const dbUsers = await readUsers();
  assert(!dbUsers.some((u) => u.id === userToDelete));

  //cleanup
  await writeUsers(initialState);

  result.body?.cancel();
});

Deno.test(
  'DELETE and PUT for /api/v1/users/:id should fail if the user does not exist',
  async () => {
    // payload: {userId: 0}
    const testToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOjB9.sQa95AnlUJ8XrMUEFx4ys_BCPKp1CyhaTYZKOBTJSeQ';

    const editedUser = {
      id: 0,
      name: 'Saul',
      email: 'saul@domain.com',
      password: '12345',
    };

    const putResult = await fetch(baseUrl + `/api/v1/users/${editedUser.id}`, {
      headers: { Authorization: `Bearer ${testToken}` },
      body: JSON.stringify(editedUser),
      method: 'PUT',
    });

    const invalidId = 0;

    const deleteResult = await fetch(baseUrl + `/api/v1/users/${invalidId}`, {
      headers: { Authorization: `Bearer ${testToken}` },
      method: 'DELETE',
    });

    assert(!putResult.ok);
    assert(!deleteResult.ok);

    putResult.body?.cancel();
    deleteResult.body?.cancel();
  }
);
