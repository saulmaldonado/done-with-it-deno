import { assertEquals, assert } from '../deps.ts';
import { User } from '../schemas/schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';
import { readUsers, writeUsers } from '../helpers/database.ts';
import { newAccessToken } from '../controllers/auth.ts';
import { testConfig } from './test.env.ts';

const baseUrl: string = config.BASE_URL;

Deno.test('/api/v1/users should return all users', async () => {
  const testToken = genToken(config.SECRET);

  let usersDb = await readUsers();
  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  const body = (await result.json()) as User[];

  assert(result.ok);
  usersDb = await readUsers();
  assertEquals(body.length, usersDb.length);
});

Deno.test('/api/v1/users/:id should return a user with the matching id', async () => {
  const testToken = genToken(config.SECRET);

  const result = await fetch(baseUrl + '/api/v1/users/1', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  const user = (await result.json()) as User;

  assert(result.ok);
  assert(user.id);
  assert(user.name);
  assert(user.email);
  assert(!user.password);
  assertEquals(user.id, 1);
});

Deno.test('request for invalid user id should fail', async () => {
  const testToken = genToken(config.SECRET);

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
    const testToken = newAccessToken(0);

    const result = await fetch(baseUrl + '/api/v1/users/1', {
      headers: { Authorization: `Bearer ${testToken}` },
    });

    const user = (await result.json()) as Partial<User>;

    assert(!user.email);
    assert(!user.password);
  }
);

Deno.test('PUT /api/v1/users/:id should edit user information in the database', async () => {
  const testToken = genToken(config.SECRET);

  const initialState = await readUsers();
  const userToEdit = 1;

  const editedUser = {
    name: 'Saul',
    email: 'saul@domain.com',
    password: '12345',
  };

  const result = await fetch(baseUrl + `/api/v1/users/${userToEdit}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(editedUser),
    method: 'PUT',
  });

  const dbUsers = await readUsers();

  const userRes = (await result.json()) as User;

  assertEquals(
    dbUsers.find((u) => u.id === userToEdit),
    { ...userRes, id: userToEdit }
  );

  // cleanup

  await writeUsers(initialState);
});

Deno.test('DELETE /api/v1/users/:id should delete user with the same id', async () => {
  const testToken = genToken(config.SECRET);

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
    const testToken = testConfig.INVALID_USER_ID;

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
