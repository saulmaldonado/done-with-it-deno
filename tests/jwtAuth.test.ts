import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { genToken, validateToken } from '../helpers/jwtAuth.ts';
import { makeJwt, Jose } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt, JwtObject } from 'https://deno.land/x/djwt/validate.ts';

const secret = 'secret';

// default key generated from genKey method
const jwtTest =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxfQ.MuIX7Ugmyc1EYnfjp_lNE79HDY2TjlG6bJFmb4ndXbM';
Deno.test('genToken should return the default key when no options are passed in', () => {
  let token = genToken();

  assertEquals(token, jwtTest);
});

Deno.test('Default token should include a payload with a userId of 1', async () => {
  let token = genToken();

  let jwt = await validateJwt(token, secret);

  assert(jwt.isValid);

  assert(jwt.payload?.userId === 1);
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
