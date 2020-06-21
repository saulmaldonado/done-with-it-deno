import { messages } from '../index.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { validateJwt, JwtValidation, JwtObject } from 'https://deno.land/x/djwt/validate.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { Message } from '../schemas/schema.ts';

const secret = 'secret';

const readMessages = async () => {
  return (await readJson('./db/messages.json')) as Message[];
};

const writeMessages = async (newMessage: Message[]) => {
  await writeFileStr('./db/messages.json', JSON.stringify(newMessage));
};

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

const sendMessage = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);
  const dbMessages = await readMessages();

  const bodyMessage = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value as Omit<
    Message,
    'fromUserId' | 'id'
  >;

  const newId = dbMessages.length + 1;

  const newMessage = { fromUserId: userId, ...bodyMessage, id: newId } as Message;
  dbMessages.push(newMessage);
  await writeMessages(dbMessages);

  ctx.response.body = newMessage;
};

export { getAllMessagesForUser, sendMessage };
