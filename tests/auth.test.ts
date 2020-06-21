import { assertEquals, assert, assertThrows } from 'https://deno.land/std/testing/asserts.ts';
import { validateToken, genToken } from '../helpers/jwtAuth.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { loggedOutToken, User } from '../schemas/schema.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

const baseUrl = 'http://localhost:8000';

const readUsers = async () => {
  return readJson('./db/users.json') as Promise<User[]>;
};
const readTokens = async () => {
  return readJson('./db/loggedOutTokens.json') as Promise<loggedOutToken[]>;
};
const writeTokens = async (tokens: loggedOutToken[]) => {
  return writeFileStr('./db/loggedOutTokens.json', JSON.stringify(tokens));
};

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
    const newUser = { name: 'Test', email: 'example@example.com', password: 'password' };

    const result = await fetch(baseUrl + '/api/v1/auth/register', {
      body: JSON.stringify(newUser),
      method: 'POST',
    });

    let dbUsers = await readUsers();
    const expectedUser = { ...newUser, id: dbUsers.length };

    assertEquals(dbUsers.find((u) => expectedUser.id === u.id)?.email, expectedUser.email);
    assert(dbUsers.length > 1);

    await writeFileStr(
      './db/users.json',
      JSON.stringify(dbUsers.filter((u) => u.id !== expectedUser.id))
    );
    dbUsers = await readUsers();

    result.body?.cancel();
  }
);

Deno.test('Registering will return two valid JWT token', async () => {
  const newUser = { name: 'Test', email: 'example@example.com', password: 'password' };

  const result = await fetch(baseUrl + '/api/v1/auth/register', {
    body: JSON.stringify(newUser),
    method: 'POST',
  });

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

  const disallowedTokens = await readTokens();

  assert(disallowedTokens.some((token) => token.refreshToken === refreshToken));

  logoutRes.body?.cancel();

  // clean up for new tokens and users written to database.

  disallowedTokens.pop();
  writeFileStr('./db/loggedOutTokens.json', JSON.stringify(disallowedTokens));
  let dbUsers = await readUsers();
  dbUsers.pop();
  await writeFileStr('./db/users.json', JSON.stringify(dbUsers));
});

Deno.test('Should return new tokens if refresh token is valid', async () => {
  const oldRefreshToken = genToken();

  const result = await fetch(baseUrl + '/api/v1/auth/refresh', {
    body: JSON.stringify(oldRefreshToken),
    method: 'POST',
  });

  let dbTokens = await readTokens();

  //new tokens
  const tokens = (await result.json()) as { accessToken: string; refreshToken: string };

  //validate new tokens
  assert((await validateJwt(tokens.accessToken, 'secret')).isValid);
  assert((await validateJwt(tokens.refreshToken, 'secret')).isValid);
  // check db for old token
  assert(dbTokens.some((token) => token.refreshToken === oldRefreshToken));

  // clean up
  dbTokens = await readTokens();
  dbTokens.pop();
  await writeTokens(dbTokens);
});

Deno.test('/api/v1/auth/refresh should fail if sent expired token', async () => {
  const expiredToken = // exp 06/19/2020 7:28AM
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTI1NzE0NTk0NzB9.F9GEnse6COV8xx34rpO35jaRCn9uG7TuzTmde1N1sZI';

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
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwbmFtZSI6kpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleAiOjE1OTI1NzE0NTk0NzB9.F9GEnse6COV8xx34rpO35jaRCn9uG7TuzTmde1N1sZI';

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
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o';

  const result = await fetch(baseUrl + '/api/v1/auth/admin', {
    headers: { Authorization: `Bearer ${invalidToken}` },
  });

  assert(!result.ok);
  assert(result.status === 403);

  result.body?.cancel();
});
