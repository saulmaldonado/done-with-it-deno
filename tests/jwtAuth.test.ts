import { assertEquals, assert } from '../deps.ts';
import { genToken, validateToken } from '../helpers/jwtAuth.ts';
import { makeJwt, Jose, Payload } from '../deps.ts';
import { validateJwt } from '../deps.ts';
import { config } from '../environment.dev.ts';
import { testConfig } from './test.env.ts';

// default key generated from genKey method
const jwtTest = testConfig.DEFAULT_TOKEN;
Deno.test('genToken should return the default key when no options are passed in', () => {
  let token = genToken();

  assertEquals(token, jwtTest);
});

Deno.test('Default token should include a payload with a userId of 1', async () => {
  let token = genToken();

  let jwt = await validateJwt(token, config.TEST_SECRET);

  assert(jwt.isValid);

  assert(jwt.payload?.userId === 1);
});

Deno.test('genToken should return a valid JWT token', async () => {
  const defaultHeader: Jose = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const defaultPayload: Payload = {
    iss: config.TOKEN_ISS as string,
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
    iss: config.TOKEN_ISS as string,
    userId: 1,
  };

  const defaultKey = config.TEST_SECRET as string;

  let jwtToken = makeJwt({ header: defaultHeader, payload: defaultPayload, key: defaultKey });

  assert(await validateToken(jwtToken));
});
