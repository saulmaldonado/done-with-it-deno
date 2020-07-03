import { RouterContext } from '../deps.ts';
import { hash, verify } from '../deps.ts';
import { setExpiration, makeJwt } from '../deps.ts';
import { validateJwt } from '../deps.ts';
import { authRegisterBodyGuard, authLoginBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { validateBody } from '../schemas/validate.ts';
import { AuthRegisterBody, AuthLoginBody } from '../schemas/bodySchema.ts';
import { config } from '../environment.dev.ts';
import {
  readLoggedOutTokens,
  writeLoggedOutTokens,
  readUsers,
  writeUsers,
} from '../helpers/database.ts';

const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

export const newAccessToken = (id: number) =>
  makeJwt({
    key: config.SECRET as string,
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: config.TOKEN_ISS as string,
      userId: id,
      exp: setExpiration(new Date().getTime() + config.ACCESS_TOKEN_EXP),
    },
  });

const newRefreshToken = (id: number) =>
  makeJwt({
    key: config.SECRET as string,
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: config.TOKEN_ISS as string,
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

  const users = await readUsers();

  if (users.some((u) => u.email === email)) {
    ctx.throw(400, 'User with the given email already exists');
  }

  const id = users.length + 1;

  const hashedPassword = await hash(password);

  const newUser = { id, name, email, password: hashedPassword };

  users.push(newUser);

  try {
    await writeUsers(users);

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

  const users = await readUsers();
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
  const loggedOutTokens = await readLoggedOutTokens();

  const refreshToken = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  loggedOutTokens.push({ refreshToken });

  try {
    await writeLoggedOutTokens(loggedOutTokens);
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

  const tokenDB = await readLoggedOutTokens();

  if (tokenDB.some((t) => t.refreshToken === refreshToken)) {
    ctx.throw(403, 'Token is disallowed. Login to retrieved new token.');
  }

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

    const tokenDB = await readLoggedOutTokens();
    tokenDB.push({ refreshToken });
    await writeLoggedOutTokens(tokenDB);

    const newToken = newAccessToken(id as number);

    const refToken = newRefreshToken(id as number);

    ctx.response.body = { accessToken: newToken, refreshToken: refToken };
  }
};

export { register, login, logout, newToken };
