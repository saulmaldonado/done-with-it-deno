import { messages } from '../index.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { validateJwt, JwtValidation, JwtObject } from 'https://deno.land/x/djwt/validate.ts';

const secret = 'secret';

const getAllMessagesForUser = async ({ request, throw: throwError, response }: RouterContext) => {
  let token = request.headers.get('Authorization')?.split(' ')[1] as string;
  const jwt = (await validateJwt(token, secret)) as JwtObject;
  const id = jwt.payload?.userId;

  if (!id) {
    throwError(401, 'Unable to authenticate userId');
  }

  const userMessages = messages.filter(
    (message) => message.fromUserId === id || message.toUserId === id
  );

  response.body = userMessages;
};

export { getAllMessagesForUser };
