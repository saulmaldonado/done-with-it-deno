import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { genToken, validateToken } from '../helpers/jwtAuth.ts';
import { makeJwt, Jose } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';

const jwtTest =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcmlkIjoxfQ.pt7uIVX6MKUiKu0Wht32Kn7Y-eTHSrSgZ9R_NcMX3uU';

Deno.test('genToken should return the default key when no options are passed in', () => {
  let token = genToken();

  assertEquals(token, jwtTest);
});

Deno.test('genToken should return a valid JWT token', async () => {
  const header: Jose = { alg: 'HS256', type: 'jwt' };
  const payload = { iss: 'deno', userid: 0 };
  const key = 'secretkey';

  let token = genToken(header, payload, key);

  let jwtToken = makeJwt({ header, payload, key });

  assert((await validateJwt(token, key)).isValid);
  assertEquals(token, jwtToken);
});

Deno.test('validate should return true on a valid token', async () => {
  const header: Jose = { alg: 'HS256', type: 'jwt' };
  const payload = { iss: 'deno', userid: 0 };
  const key = 'secretkey';

  let jwtToken = makeJwt({ header, payload, key });

  assert(await validateToken(jwtToken, key));
});
