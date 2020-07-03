import { genToken } from '../helpers/jwtAuth.ts';
import { config } from '../environment.dev.ts';
import { readUsers, writeUsers } from '../helpers/database.ts';
import { assert } from '../deps.ts';
import { User } from '../schemas/schema.ts';

const baseUrl: string = config.BASE_URL;

Deno.test(
  ' POST to /api/v1/notifications should add notificationToken property to user',
  async () => {
    const initialState = await readUsers();
    const testToken = genToken(config.SECRET);
    const testNotificationToken = 'ExponentPushToken[ioweuwvjnw3423rvndv]';

    const result = await fetch(baseUrl + '/api/v1/notifications', {
      headers: { Authorization: `Bearer ${testToken}` },
      method: 'PUT',
      body: JSON.stringify({ token: testNotificationToken }),
    });

    const user = (await result.json()) as User;

    const dbUsers = await readUsers();

    const foundUser = dbUsers.some((u) => u.notificationToken === testNotificationToken);

    assert(result.ok);
    assert(foundUser);

    //cleanup
    await writeUsers(initialState);
  }
);

Deno.test(
  ' Delete to /api/v1/notifications should add notificationToken property to user',
  async () => {
    const initialState = await readUsers();
    const testToken = genToken(config.SECRET);

    const testNotificationToken = 'ExponentPushToken[ioweuwvjnw3423rvndv]';

    const result1 = await fetch(baseUrl + '/api/v1/notifications', {
      headers: { Authorization: `Bearer ${testToken}` },
      method: 'PUT',
      body: JSON.stringify({ token: testNotificationToken }),
    });

    const notificationToken = (await result1.json()) as { token: string };

    const result2 = await fetch(baseUrl + '/api/v1/notifications', {
      headers: { Authorization: `Bearer ${testToken}` },
      method: 'DELETE',
    });

    const result2Message = await result2.text();

    const dbUsers = await readUsers();

    const foundUser = dbUsers.some((u) => u.notificationToken === testNotificationToken);

    assert(result2.ok);
    assert(!foundUser);

    //cleanup
    await writeUsers(initialState);
  }
);
