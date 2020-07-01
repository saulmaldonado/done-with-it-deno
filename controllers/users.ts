import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { readJson, writeFileStr, writeJson } from 'https://deno.land/std/fs/mod.ts';
import { validateJwt, JwtValidation, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { User } from '../schemas/schema.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { validateBody } from '../schemas/validate.ts';
import { EditUserBody } from '../schemas/bodySchema.ts';
import { editUserBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { config } from '../environment.dev.ts';
import { readUsers, writeUsers } from '../helpers/database.ts';
import { GetUserByIdParams, EditUserParams, DeleteUserParams } from '../schemas/paramsSchema.ts';

const secret = config.SECRET;

const getAllUsers = async ({ response }: RouterContext) => {
  response.body = await readUsers();
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

      /**
       * request from users with different a userId
       * will return an abridged user object
       */
    } else if (jwtId !== Number(id)) {
      response.body = { id: user.id, name: user.name };
    } else {
      response.body = user;
    }
  }
};

const editUser = async (ctx: RouterContext<EditUserParams>) => {
  const userId = await getTokenUserId(ctx);
  const id = Number(ctx.params.id);

  if (id !== userId) {
    ctx.throw(403, "Unauthorized to edit user's information");
  } else {
    const dbUsers = await readUsers();

    const user = await validateBody<EditUserBody>(ctx, editUserBodyGuard);

    let userIndex = dbUsers.findIndex((u) => u.id === id);
    if (userIndex < 0) {
      ctx.throw(404, 'User does not exists');
    }

    dbUsers.splice(userIndex, 1, { ...user, id: id });

    await writeUsers(dbUsers);

    ctx.response.body = user;
  }
};

const deleteUser = async (ctx: RouterContext<DeleteUserParams>) => {
  const userId = await getTokenUserId(ctx);

  const id = Number(ctx.params.id);

  if (id !== userId) {
    ctx.throw(403, "Unauthorized to edit user's information");
  } else {
    const dbUsers = await readUsers();
    const userIndex = dbUsers.findIndex((u) => u.id === id);

    if (userIndex < 0) {
      ctx.throw(404, 'User does not exist');
    }

    dbUsers.splice(userIndex, 1);

    await writeUsers(dbUsers);

    ctx.response.body = 'User deleted';
  }
};

export { getAllUsers, getUserById, editUser, deleteUser };
