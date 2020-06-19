import { RouterContext, Context, Request } from 'https://deno.land/x/oak/mod.ts';
import { users } from '../index.ts';
import { writeFileStr } from 'https://deno.land/std/fs/mod.ts';

const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

const register = async (ctx: RouterContext) => {
  checkForBody(ctx);

  const { email, password, name } = (await ctx.request.body()).value;
  const id = users.length + 1;

  users.push({ id, name, email, password });

  try {
    await writeFileStr('./db/users.json', JSON.stringify(users));
    ctx.response.body = 'Registered Successfully!';
  } catch (error) {
    ctx.throw(400, 'An Error Occurred');
  }
};

export { register };
