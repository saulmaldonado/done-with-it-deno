import { assertEquals, assert } from '../deps.ts';
import { Message } from '../schemas/schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { SendMessageBody } from '../schemas/bodySchema.ts';
import { config } from '../environment.dev.ts';
import { writeMessages, readMessages } from '../helpers/database.ts';

const baseUrl: string = config.BASE_URL;

const messages = await readMessages();

Deno.test('/api/v1/messages should return messages for user', async () => {
  const testToken = genToken(config.SECRET);

  const result = await fetch(baseUrl + '/api/v1/messages', {
    headers: { Authorization: `Bearer ${testToken}` },
  });

  const responseMessages = (await result.json()) as Message[];

  const userId = 1;

  const userMessages = messages.filter(
    (message) => message.fromUserId === userId || message.toUserId === userId
  );

  assert(result.ok);
  assertEquals(userMessages, responseMessages);
});

Deno.test('Should add a message to the database.', async () => {
  const testToken = genToken(config.SECRET);

  const messageBody: SendMessageBody = {
    listingId: 1,
    content: 'Yo',
    dateTime: new Date().getTime(),
  };

  const result = await fetch(baseUrl + '/api/v1/messages', {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(messageBody),
    method: 'POST',
  });

  const newMessage = (await result.json()) as Message;

  const dbMessages = await readMessages();

  assert(dbMessages.some((m) => m.dateTime === newMessage.dateTime));
  assert(result.ok);

  //clean up

  dbMessages.pop();
  await writeMessages(dbMessages);
});

Deno.test('POST /api/v1/messages should fail when given a non existent listingId', async () => {
  const testToken = genToken(config.SECRET);
  const body = {
    listingId: 0,
    content: 'Yo',
    dateTime: new Date().getTime(),
  };

  const result = await fetch(baseUrl + '/api/v1/messages', {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const error = await result.text();
  console.log(error);

  assert(!result.ok);
  assertEquals(error, 'Listing does not exist');
});
