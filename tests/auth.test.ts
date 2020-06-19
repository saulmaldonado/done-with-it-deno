import {
  assertEquals,
  assert,
  assertThrowsAsync,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import { genToken, validateToken } from '../auth/jwtAuth.ts';
import { makeJwt, setExpiration, Jose, Payload } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { loggedOutToken, User } from '../schema.ts';
import users from '../routes/users.ts';

const loggedOutTokens = (await readJson('./db/loggedOutTokens.json')) as loggedOutToken[];
const baseUrl = 'http://localhost:8000';

Deno.test('Making an login or register request without a body will fail', async () => {
  const result = await fetch(
    baseUrl + '/api/v1/auth/register',
    { method: 'POST' }
    //   ,
  );

  assertThrows(() => {
    assert(result.ok);
  });

  result.body?.cancel();
});

Deno.test(
  'Sending a register request with a valid body will add credentials to the db',
  async () => {
    const newUser = { name: 'Test', email: 'example@example.com', password: 'password' };

    const result = await fetch(baseUrl + '/api/v1/auth/register', {
      body: JSON.stringify(newUser),
      method: 'POST',
    });

    const dbUsers = (await readJson('./db/users.json')) as User[];
    const expectedUser = { ...newUser, id: dbUsers.length };

    assertEquals(dbUsers.find((u) => expectedUser.id === u.id)?.email, expectedUser.email);
    assert(dbUsers.length > 1);

    result.body?.cancel();
  }
);

Deno.test('Registering will return two valid JWT token', async () => {
  const newUser = { name: 'Test', email: 'example@example.com', password: 'password' };

  const result = await fetch(baseUrl + '/api/v1/auth/register', {
    body: JSON.stringify(newUser),
    method: 'POST',
  });

  // const tokens =  await result.body(). as {accessToken: string; refreshToken: string};
  const { accessToken, refreshToken } = (await result.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  assert(await validateToken(accessToken));
  assert(await validateToken(refreshToken));
});

Deno.test('Logging in with the right credentials will return jwt tokens', async () => {
  const existingUser = { password: 'password', email: 'example@example.com' };

  const result = await fetch(baseUrl + '/api/v1/auth/login', {
    body: JSON.stringify(existingUser),
    method: 'POST',
  });

  const { accessToken, refreshToken } = (await result.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  assert(accessToken);
  assert(refreshToken);
});

Deno.test('Logging in with non-existent email will return not found error', async () => {
  const nonExistentUser = { email: 'N/A@example.com', password: 'password' };

  const result = await fetch(baseUrl + '/api/v1/auth/login', {
    body: JSON.stringify(nonExistentUser),
    method: 'POST',
  });

  assertEquals(result.status, 404);
  result.body?.cancel();
});

Deno.test('Logging in with incorrect password will return a forbidden error.', async () => {
  const existingUser = { email: 'example@example.com', password: 'passord' };

  const result = await fetch(baseUrl + '/api/v1/auth/login', {
    body: JSON.stringify(existingUser),
    method: 'POST',
  });

  assertEquals(result.status, 403);
  result.body?.cancel();
});

Deno.test('Logging out will add the users refresh token to db of disallowed tokens', async () => {
  const existingUser = { email: 'example@example.com', password: 'password' };

  const loginRes = await fetch(baseUrl + '/api/v1/auth/login', {
    body: JSON.stringify(existingUser),
    method: 'POST',
  });

  const { refreshToken } = (await loginRes.json()) as {
    refreshToken: string;
  };

  const logoutRes = await fetch(baseUrl + '/api/v1/auth/logout', {
    body: JSON.stringify(refreshToken),
    method: 'POST',
  });

  const disallowedTokens = (await readJson('./db/loggedOutTokens.json')) as loggedOutToken[];

  assert(!disallowedTokens.includes({ refreshToken }));

  logoutRes.body?.cancel();
});
