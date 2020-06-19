import { RouterContext, Context, Request } from 'https://deno.land/x/oak/mod.ts';
import { users } from '../index.ts';
import { writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { hash, verify } from 'https://deno.land/x/argon2/lib/mod.ts';
import { genToken } from '../auth/jwtAuth.ts';

const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

const register = async (ctx: RouterContext) => {
  checkForBody(ctx);

  /**
   * TODO server side validation for credentials
   */
  const { email, password, name } = (await ctx.request.body()).value;
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
    const newToken = genToken({ alg: 'HS256', typ: 'JWT' }, { iss: 'donewithit', userId: id });
    ctx.response.body = { jwt: newToken };
  } catch (error) {
    ctx.throw(400, 'An Error Occurred');
  }
};

const login = async (ctx: RouterContext) => {
  checkForBody(ctx);

  const { email, password } = (await ctx.request.body()).value;

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
    { iss: 'donewithit', userId: foundUser.id }
  );

  ctx.response.body = { jwt: newToken };
};

export { register, login };
