import { assertEquals, assert, assertThrows } from 'https://deno.land/std/testing/asserts.ts';
import { validateToken, genToken } from '../helpers/jwtAuth.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { config } from '../environment.dev.ts';
import {
  readUsers,
  readLoggedOutTokens,
  writeLoggedOutTokens,
  writeUsers,
} from '../helpers/database.ts';
import { testConfig } from './test.env.ts';

const baseUrl: string = config.BASE_URL;

Deno.test('Making an login or register request without a body will fail', async () => {
  const result = await fetch(baseUrl + '/api/v1/auth/register', { method: 'POST' });

  assertThrows(() => {
    assert(result.ok);
  });

  result.body?.cancel();
});

Deno.test(
  'Sending a register request with a valid body will add credentials to the db',
  async () => {
    const newUser = {
      name: 'Test',
      email: 'example@example.com',
      password: 'password',
    };

    const result = await fetch(baseUrl + '/api/v1/auth/register', {
      body: JSON.stringify(newUser),
      method: 'POST',
    });

    let dbUsers = await readUsers();
    const expectedUser = { ...newUser, id: dbUsers.length };

    assertEquals(dbUsers.find((u) => expectedUser.id === u.id)?.email, expectedUser.email);
    assert(dbUsers.length > 1);

    await writeUsers(dbUsers.filter((u) => u.id !== expectedUser.id));
    dbUsers = await readUsers();

    result.body?.cancel();
  }
);

Deno.test('Registering will return two valid JWT token', async () => {
  const newUser = {
    name: 'Test',
    email: 'example@example.com',
    password: 'password',
  };

  const result = await fetch(baseUrl + '/api/v1/auth/register', {
    body: JSON.stringify(newUser),
    method: 'POST',
  });

  const { accessToken, refreshToken } = (await result.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  assert(await validateToken(accessToken, config.SECRET));
  assert(await validateToken(refreshToken, config.SECRET));
});

Deno.test('Logging in with the right credentials will return jwt tokens', async () => {
  const existingUser = { password: 'password', email: 'example@example.com' };

  const result = await fetch(baseUrl + '/api/v1/auth/login', {
    body: JSON.stringify(existingUser),
    method: 'POST',
  });

  const { accessToken, refreshToken } = await result.json();

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

  const disallowedTokens = await readLoggedOutTokens();

  assert(disallowedTokens.some((token) => token.refreshToken === refreshToken));

  logoutRes.body?.cancel();

  // clean up for new tokens and users written to database.

  disallowedTokens.pop();
  await writeLoggedOutTokens(disallowedTokens);
  let dbUsers = await readUsers();
  dbUsers.pop();
  await writeUsers(dbUsers);
});

Deno.test('Should return new tokens if refresh token is valid', async () => {
  const oldRefreshToken = genToken(config.SECRET);

  const result = await fetch(baseUrl + '/api/v1/auth/refresh', {
    body: JSON.stringify(oldRefreshToken),
    method: 'POST',
  });

  let dbTokens = await readLoggedOutTokens();

  //new tokens
  const tokens = (await result.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  //validate new tokens
  assert((await validateJwt(tokens.accessToken, config.SECRET)).isValid);
  assert((await validateJwt(tokens.refreshToken, config.SECRET)).isValid);
  // check db for old token
  assert(dbTokens.some((token) => token.refreshToken === oldRefreshToken));

  // clean up
  dbTokens = await readLoggedOutTokens();
  dbTokens.pop();
  await writeLoggedOutTokens(dbTokens);
});

Deno.test('/api/v1/auth/refresh should fail if sent expired token', async () => {
  const expiredToken = testConfig.EXPIRED_TOKEN;
  const expiredTokenResult = await fetch(baseUrl + '/api/v1/auth/refresh', {
    body: JSON.stringify(expiredToken),
    method: 'POST',
  });

  const message = await expiredTokenResult.text();

  assert(!expiredTokenResult.ok);
  assertEquals(expiredTokenResult.status, 401);
  assertEquals('Refresh token expired. Log in again to retrieve new token.', message);
});

Deno.test('/api/v1/auth/refresh should fail if sent invalid token', async () => {
  const invalidToken = testConfig.INVALID_TOKEN;

  const invalidTokenResult = await fetch(baseUrl + '/api/v1/auth/refresh', {
    body: JSON.stringify(invalidToken),
    method: 'POST',
  });

  const message = await invalidTokenResult.text();

  assert(!invalidTokenResult.ok);
  assertEquals(invalidTokenResult.status, 401);
  assertEquals('Invalid token. Log in to retrieve new token.', message);
});

Deno.test('Endpoints with admin middleware should fail with nonAdmin requests', async () => {
  // payload: {isAdmin: undefined}
  const invalidToken = testConfig.NON_ADMIN_TOKEN;
  const result = await fetch(baseUrl + '/api/v1/auth/admin', {
    headers: { Authorization: `Bearer ${invalidToken}` },
  });

  assert(!result.ok);
  assert(result.status === 403);

  result.body?.cancel();
});
