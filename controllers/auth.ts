import { RouterContext, Context, Request } from 'https://deno.land/x/oak/mod.ts';
import { users, loggedOutTokens } from '../index.ts';
import { writeFileStr, readJson } from 'https://deno.land/std/fs/mod.ts';
import { hash, verify } from 'https://deno.land/x/argon2/lib/mod.ts';
import { genToken } from '../auth/jwtAuth.ts';
import { setExpiration } from 'https://deno.land/x/djwt/create.ts';
import listings from '../routes/listings.ts';
import { User } from '../schema.ts';

const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

const register = async (ctx: RouterContext) => {
  checkForBody(ctx);

  const users = (await readJson('./db/users.json')) as User[];

  /**
   * TODO server side validation for credentials
   */
  const { email, password, name } = (
    await ctx.request.body({ contentTypes: { json: ['text'] } })
  ).value;

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

    const newToken = genToken(
      { alg: 'HS256', typ: 'JWT' },
      { iss: 'donewithit', userId: id, exp: setExpiration(new Date().getTime() + 600000) }
    );

    const refreshToken = genToken(
      { alg: 'HS256', typ: 'JWT' },
      {
        iss: 'donewithit',
        userId: id,
        exp: setExpiration(new Date().getTime() + 600000 * 60 * 24),
      }
    );

    ctx.response.body = { accessToken: newToken, refreshToken: refreshToken };
  } catch (error) {
    ctx.throw(400, 'An Error Occurred');
  }
};

const login = async (ctx: RouterContext) => {
  checkForBody(ctx);
  const users = (await readJson('./db/users.json')) as User[];

  const { email, password } = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  const foundUser = users.find((users) => users.email === email);

  if (!foundUser) {
    ctx.throw(404, 'Account does not exists.');
  }

  const validated = await verify(foundUser.password, password);

  if (!validated) {
    ctx.throw(403, 'Password is in correct');
  }

  const newToken = genToken(
    { alg: 'HS256', typ: 'JWT' },
    { iss: 'donewithit', userId: foundUser.id, exp: setExpiration(new Date().getTime() + 600000) }
  );

  const refreshToken = genToken(
    { alg: 'HS256', typ: 'JWT' },
    {
      iss: 'donewithit',
      userId: foundUser.id,
      exp: setExpiration(new Date().getTime() + 600000 * 60 * 24),
    }
  );

  console.log({ accessToken: newToken, refreshToken: refreshToken });

  ctx.response.body = { accessToken: newToken, refreshToken: refreshToken };
};

/**
 * logging out will place the refresh token the local db
 * of logged out tokens to prevent it from requesting new access tokens
 * This does not disallow the live access token (10min exp) from making request.
 */
const logout = async (ctx: RouterContext) => {
  checkForBody(ctx);

  const refreshToken = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;
  console.log(refreshToken);

  loggedOutTokens.push({ refreshToken });

  try {
    await writeFileStr('./db/loggedOutTokens.json', JSON.stringify(loggedOutTokens));
    ctx.response.body = 'Logged out';
  } catch (error) {
    ctx.throw(500, 'An Error Occurred');
  }
};

export { register, login, logout };
