import { RouterContext } from '../deps.ts';
import { validateJwt, JwtObject } from '../deps.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { Message } from '../schemas/schema.ts';
import { validateBody } from '../schemas/validate.ts';
import { SendMessageBody } from '../schemas/bodySchema.ts';
import { sendMessageBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { config } from '../environment.dev.ts';
import { readMessages, writeMessages, readListings } from '../helpers/database.ts';

const secret = config.SECRET;

const getAllMessagesForUser = async ({ request, throw: throwError, response }: RouterContext) => {
  let token = request.headers.get('Authorization')?.split(' ')[1] as string;
  const jwt = (await validateJwt(token, secret)) as JwtObject;
  const id = jwt.payload?.userId;
  const messages = await readMessages();

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

  const bodyMessage = await validateBody<SendMessageBody>(ctx, sendMessageBodyGuard);
  const newId = dbMessages.length + 1;

  const listings = await readListings();
  const foundListing = listings.find((l) => l.id === bodyMessage.listingId);

  if (!foundListing) {
    ctx.throw(404, 'Listing does not exist');
  }

  const newMessage = {
    fromUserId: userId,
    ...bodyMessage,
    id: newId,
    toUserId: foundListing.userId,
  } as Message;
  dbMessages.push(newMessage);
  await writeMessages(dbMessages);

  ctx.response.body = newMessage;
};

export { getAllMessagesForUser, sendMessage };
