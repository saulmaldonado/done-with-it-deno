import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { validateJwt, JwtValidation, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { User } from '../schema.ts';

const secret = 'secret';

const readUsers = async () => {
  return (await readJson('./db/users.json')) as User[];
};

const getAllUsers = async ({ response }: RouterContext) => {
  const users = (await readJson('./db/users.json')) as User[];
  response.body = users;
};

type getUserByIdParams = {
  id: string;
};

const getUserById = async ({
  params: { id },
  response,
  throw: throwError,
  request,
}: RouterContext<getUserByIdParams>) => {
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

export { getAllUsers, getUserById };
