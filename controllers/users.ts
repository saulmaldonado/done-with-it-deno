import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { readJson, writeFileStr, writeJson } from 'https://deno.land/std/fs/mod.ts';
import { validateJwt, JwtValidation, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { User } from '../schema.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';

const secret = 'secret';

const readUsers = async () => {
  return (await readJson('./db/users.json')) as User[];
};
const writeUsers = async (newUsers: User[]) => {
  await writeFileStr('./db/users.json', JSON.stringify(newUsers));
};

const getAllUsers = async ({ response }: RouterContext) => {
  const users = (await readJson('./db/users.json')) as User[];
  response.body = users;
};

type GetUserByIdParams = {
  id: string;
};

const getUserById = async ({
  params: { id },
  response,
  throw: throwError,
  request,
}: RouterContext<GetUserByIdParams>) => {
  const token = request.headers.get('Authorization')?.split(' ')[1] as string;
  const jwt = (await validateJwt(token, secret)) as JwtObject;
  const jwtId = jwt.payload?.userId;

  if (jwtId === undefined) {
    throwError(401, 'Unable to authenticate user');
  } else {
    const users = await readUsers();

    let user = users.find((user) => user.id === Number(id));

    if (!user) {
      throwError(404, 'User not found');
    } else if (jwtId !== id) {
      response.body = { id: user.id, name: user.name };
    } else {
      response.body = user;
    }
  }
};
type EditUserParams = {
  id: string;
};

const editUser = async (ctx: RouterContext<EditUserParams>) => {
  const userId = await getTokenUserId(ctx);
  const id = Number(ctx.params.id);

  if (id !== userId) {
    ctx.throw(403, "Unauthorized to edit user's information");
  } else {
    const dbUsers = await readUsers();

    const user = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value as User;

    let userIndex = dbUsers.findIndex((u) => u.id === id);

    dbUsers.splice(userIndex, 1, user);

    await writeUsers(dbUsers);

    ctx.response.body = user;
  }
};

export { getAllUsers, getUserById, editUser };
