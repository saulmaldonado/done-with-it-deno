import { assertEquals, assert, assertThrows } from '../deps.ts';
import { validateToken, genToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';
import { testConfig } from './test.env.ts';

const baseUrl: string = config.BASE_URL;

Deno.test('authenticate middleware should allow requests with valid JWT access token', async () => {
  const testToken = genToken(config.SECRET);

  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  assert(result.ok);

  result.body?.cancel();
});

Deno.test('authenticate middleware should disallow requests without token', async () => {
  const result = await fetch(baseUrl + '/api/v1/users');

  const message = await result.text();

  assert(!result.ok);
  assertEquals(result.status, 401);
  assertEquals('Missing authentication credentials', message);
});

Deno.test('authenticate middleware should disallow requests with expired tokens', async () => {
  const expiredToken = testConfig.ADMIN_EXPIRED;

  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });

  const message = await result.text();

  assert(!result.ok);
  assertEquals(result.status, 401);
  assertEquals('Token is expired', message);
});

Deno.test('authenticate middleware should disallow requests with invalid tokens', async () => {
  const invalidToken = testConfig.INVALID_TOKEN;

  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${invalidToken}` },
  });

  const message = await result.text();

  assert(!result.ok);
  assertEquals(result.status, 401);
  assertEquals('Invalid Token', message);
});
