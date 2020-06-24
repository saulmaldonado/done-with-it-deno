import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { writeFileStr, readJson } from 'https://deno.land/std/fs/mod.ts';
import { hash, verify, Variant, Version, ThreadMode } from 'https://deno.land/x/argon2/lib/mod.ts';
import { setExpiration, makeJwt } from 'https://deno.land/x/djwt/create.ts';
import { validateJwt } from 'https://deno.land/x/djwt/validate.ts';
import { User, loggedOutToken } from '../schemas/schema.ts';
import { authRegisterBodyGuard, authLoginBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { validateBody } from '../schemas/validate.ts';
import { AuthRegisterBody, AuthLoginBody } from '../schemas/bodySchema.ts';
import { config } from '../environment.dev.ts';

const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

const getLoggedOutTokens = async () => {
  return readJson('./db/loggedOutTokens.json') as Promise<loggedOutToken[]>;
};

const writeLoggedOutTokens = async (newTokens: loggedOutToken[]) => {
  writeFileStr('./db/loggedOutTokens.json', JSON.stringify(newTokens));
};

export const newAccessToken = (id: number) =>
  makeJwt({
    key: config.SECRET as string,
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: 'donewithit',
      userId: id,
      exp: setExpiration(new Date().getTime() + config.ACCESS_TOKEN_EXP),
    },
  });

const newRefreshToken = (id: number) =>
  makeJwt({
    key: config.SECRET as string,
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: 'donewithit',
      userId: id,
      exp: setExpiration(new Date().getTime() + config.REFRESH_TOKEN_EXP),
    },
  });

const register = async (ctx: RouterContext) => {
  checkForBody(ctx);
  const { email, password, name } = await validateBody<AuthRegisterBody>(
    ctx,
    authRegisterBodyGuard
  );

  const users = (await readJson('./db/users.json')) as User[];

  const id = users.length + 1;

  /**
   * argon 2 hash options creates an unverifiable password hash
   * currently default options are passed in
   * TODO fix argon2 hash method to create a valid hash with salt and secret options
   */

  const hashedPassword = await hash(password);

  const newUser = { id, name, email, password: hashedPassword };

  users.push(newUser);

  try {
    await writeFileStr('./db/users.json', JSON.stringify(users));

    const newToken = newAccessToken(id);

    const refreshToken = newRefreshToken(id);

    ctx.response.body = { accessToken: newToken, refreshToken: refreshToken };
  } catch (error) {
    ctx.throw(400, 'An Error Occurred');
  }
};

const login = async (ctx: RouterContext) => {
  checkForBody(ctx);

  const { email, password } = await validateBody<AuthLoginBody>(ctx, authLoginBodyGuard);

  const users = (await readJson('./db/users.json')) as User[];
  const foundUser = users.find((users) => users.email === email);

  if (!foundUser) {
    ctx.throw(404, 'Account does not exists.');
  }

  const validated = await verify(foundUser.password, password);

  if (!validated) {
    ctx.throw(403, 'Password is in correct');
  }

  const newToken = newAccessToken(foundUser.id);

  const refreshToken = newRefreshToken(foundUser.id);

  ctx.response.body = { accessToken: newToken, refreshToken: refreshToken };
};

/**
 * logging out will place the refresh token the local db
 * of logged out tokens to prevent it from requesting new access tokens
 * This does not disallow the live access token (10min exp) from making request.
 */
const logout = async (ctx: RouterContext) => {
  checkForBody(ctx);
  const loggedOutTokens = await getLoggedOutTokens();

  const refreshToken = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  loggedOutTokens.push({ refreshToken });

  try {
    await writeFileStr('./db/loggedOutTokens.json', JSON.stringify(loggedOutTokens));
    ctx.response.body = 'Logged out';
  } catch (error) {
    ctx.throw(500, 'An Error Occurred');
  }
};

/**
 * request new tokens with refresh token. refresh token will be added to
 * the db of disallowed token to prevent it from make other requests.
 *
 * body:{refreshToken: string}
 */
const newToken = async (ctx: RouterContext) => {
  checkForBody(ctx);
  const secret = config.SECRET;

  const refreshToken = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  const result = await validateJwt(refreshToken, secret);

  if (!result.isValid) {
    if (result.isExpired) {
      ctx.throw(401, 'Refresh token expired. Log in again to retrieve new token.');
    } else {
      ctx.throw(401, 'Invalid token. Log in to retrieve new token.');
    }
  } else {
    const id = result.payload?.userId;
    if (!id) {
      ctx.throw(401, 'User Id not provided. Token is invalid');
    }

    const tokenDB = await getLoggedOutTokens();
    tokenDB.push({ refreshToken });
    await writeLoggedOutTokens(tokenDB);

    const newToken = newAccessToken(id as number);

    const refToken = newRefreshToken(id as number);

    ctx.response.body = { accessToken: newToken, refreshToken: refToken };
  }
};

export { register, login, logout, newToken };
