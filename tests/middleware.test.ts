import { assertEquals, assert, assertThrows } from 'https://deno.land/std/testing/asserts.ts';
import { validateToken, genToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';

const baseUrl: string = config.BASE_URL;

const delay = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(null);
    }, 5000);
  });
};

Deno.test('authenticate middleware should allow requests with valid JWT access token', async () => {
  await delay();
  const testToken = genToken();

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
  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1OTI1NzE0NTk0NzB9.F9GEnse6COV8xx34rpO35jaRCn9uG7TuzTmde1N1sZI';

  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });

  const message = await result.text();

  assert(!result.ok);
  assertEquals(result.status, 401);
  assertEquals('Token is expired', message);
});

Deno.test('authenticate middleware should disallow requests with invalid tokens', async () => {
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwbmFtZSI6kpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleAiOjE1OTI1NzE0NTk0NzB9.F9GEnse6COV8xx34rpO35jaRCn9uG7TuzTmde1N1sZI';

  const result = await fetch(baseUrl + '/api/v1/users', {
    headers: { Authorization: `Bearer ${invalidToken}` },
  });

  const message = await result.text();

  assert(!result.ok);
  assertEquals(result.status, 401);
  assertEquals('Invalid Token', message);
});
