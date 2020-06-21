import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { genToken, validateToken } from '../helpers/jwtAuth.ts';
import { validateBody } from '../schemas/validate.ts';
import { authLoginBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { AuthLoginBody } from '../schemas/bodySchema.ts';
import { router } from '../routes/root.ts';

const baseUrl = 'http://localhost:8000';

Deno.test('Login type guard should fail when given invalid body', async () => {
  const result = await fetch(baseUrl + '/api/v1/test', {
    body: JSON.stringify({ name: 'saul', password: 1234 }),
    method: 'POST',
  });

  const body = await result.json();

  assert(!authLoginBodyGuard(body));
});
