import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Message } from '../schema.ts';
import { genToken } from '../helpers/jwtAuth.ts';

const messages = (await readJson('./db/messages.json')) as Message[];
const baseUrl = 'http://localhost:8000';

const testToken = genToken();

Deno.test('/api/v1/messages should return messages for user', async () => {
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
