import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { User } from '../schema.ts';

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
}: RouterContext<getUserByIdParams>) => {
  const users = (await readJson('./db/users.json')) as User[];

  let user = users.find((user) => user.id === Number(id));

  if (!user) {
    throwError(404, 'User not found');
  } else {
    response.body = user;
  }
};

export { getAllUsers, getUserById };
