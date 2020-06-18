import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { users } from '../index.ts';

const getAllUsers = ({ response }: RouterContext) => {
  response.body = users;
};

type getUserByIdParams = {
  id: string;
};

const getUserById = ({
  params: { id },
  response,
  throw: throwError,
}: RouterContext<getUserByIdParams>) => {
  let user = users.find((user) => user.id === Number(id));

  if (!user) {
    throwError(404, 'User not found');
  } else {
    response.body = user;
  }
};

export { getAllUsers, getUserById };
