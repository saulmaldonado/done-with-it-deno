import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Message } from '../schemas/schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { SendMessageBody } from '../schemas/bodySchema.ts';
import { config } from '../environment.dev.ts';
import { writeMessages, readMessages } from '../helpers/database.ts';

const baseUrl: string = config.BASE_URL;

const messages = (await readJson('./db/messages.json')) as Message[];

Deno.test('/api/v1/messages should return messages for user', async () => {
  const testToken = genToken();

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
  const testToken = genToken();

  const messageBody: SendMessageBody = {
    toUserId: 2,
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
