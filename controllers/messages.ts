import { messages } from '../index.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

const getAllMessagesForUser = async ({ request, throw: throwError, response }: RouterContext) => {
  let token = request.headers.get('Authorization');
  if (!token) {
    throwError(401, 'You must be logged in.');
  } else if (token !== '1234') {
    throwError(403, 'You are not authorized to request these messages');
  } else {
    const id = 1;

    const userMessages = messages.filter(
      (message) => message.fromUserId === id || message.toUserId === id
    );

    response.body = userMessages;
  }
};

export { getAllMessagesForUser };
