import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { genToken, validateToken } from '../helpers/jwtAuth.ts';
import { makeJwt, Jose, Payload } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { config } from '../environment.dev.ts';

const secret = config.TEST_SECRET;

// default key generated from genKey method
const jwtTest =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWluIjp0cnVlfQ.z37ryTFKXbTkp-FNHJUMULNaB8pdMwDO0DpVIVc9DmQ';
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
  const defaultHeader: Jose = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const defaultPayload: Payload = {
    iss: 'donewithit',
    userId: 1,
    isAdmin: true,
  };

  const defaultKey = config.TEST_SECRET as string;

  let token = genToken();

  let jwtToken = makeJwt({ header: defaultHeader, payload: defaultPayload, key: defaultKey });

  assert((await validateJwt(token, defaultKey)).isValid);
  assertEquals(token, jwtToken);
});

Deno.test('validate should return true on a valid token', async () => {
  const defaultHeader: Jose = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const defaultPayload: Payload = {
    iss: 'donewithit',
    userId: 1,
  };

  const defaultKey = config.TEST_SECRET as string;

  let jwtToken = makeJwt({ header: defaultHeader, payload: defaultPayload, key: defaultKey });

  assert(await validateToken(jwtToken));
});
