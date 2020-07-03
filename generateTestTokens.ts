import { makeJwt } from './deps.ts';
import { config } from './environment.dev.ts';
import { Jose } from './deps.ts';

const testSecret = config.TEST_SECRET;
const secret = config.SECRET;
const header: Jose = {
  alg: 'HS256',
  typ: 'JWT',
};
const iss = config.TOKEN_ISS;

const encoder = new TextEncoder();
const configFile = encoder.encode(
  `
    export enum testConfig {
        DEFAULT_TOKEN = '${makeJwt({
          key: testSecret,
          header,
          payload: {
            iss,
            userId: 1,
            isAdmin: true,
          },
        })}',
        EXPIRED_TOKEN = '${makeJwt({
          header,
          key: testSecret,
          payload: {
            iss,
            userId: 1,
            isAdmin: true,
            exp: 1592997623466,
          },
        })}',
        INVALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkbd2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWjp0cnVlLCJleHAi1OTI5OTY5OTcwODF9.4lZpt3s_JmAiORJeMnqluBo429UemVsK865h6_Lz_f0',
        NON_ADMIN_TOKEN = '${makeJwt({
          header,
          key: secret,
          payload: {
            iss,
            userId: 1,
          },
        })}',
        ADMIN_EXPIRED = '${makeJwt({
          header,
          key: secret,
          payload: {
            iss,
            userId: 1,
            isAdmin: true,
            exp: 1592997623466,
          },
        })}',
        INVALID_USER_ID = '${makeJwt({
          header,
          key: secret,
          payload: {
            iss,
            userId: 0,
            isAdmin: true,
            exp: 1592997623466,
          },
        })}',
        NO_USER_ID = '${makeJwt({
          header,
          key: secret,
          payload: {
            iss,
            isAdmin: true,
            exp: 1592997623466,
          },
        })}',
      };
    `
);
const file = await Deno.open('./tests/test.env.ts', { create: true, write: true });

await file.write(configFile);

file.close();
