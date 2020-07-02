import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { readUsers, writeUsers } from '../helpers/database.ts';
import { sendNotification } from '../helpers/expoPushNotifications.ts';

const addNotifications = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);

  const users = await readUsers();

  const foundUserIndex = users.findIndex((u) => u.id === userId);

  if (foundUserIndex < 0) {
    ctx.throw(400, 'User does not exist');
  }

  const notification = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value as {
    token: string;
  };

  users[foundUserIndex].notificationToken = notification.token;

  await writeUsers(users);

  ctx.response.body = users[foundUserIndex];
};

const deleteNotification = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);

  const users = await readUsers();

  const foundUserIndex = users.findIndex((u) => u.id === userId);

  if (foundUserIndex < 0) {
    ctx.throw(400, 'User does not exist');
  }

  users[foundUserIndex].notificationToken = undefined;
  await writeUsers(users);

  ctx.response.body = 'Notification Token removed';
};

const sendTestNotification = async (ctx: RouterContext) => {
  try {
    await sendNotification('ExponentPushToken[o31gW8N_dWQKT6RT53hAO5]', {
      title: 'This is a test',
      body: 'Hello is this working?',
    });
  } catch (error) {
    console.log(error);
    ctx.throw(500, 'Error Sending Token');
  }

  ctx.response.body = 'Token Sent!';
};

export { addNotifications, deleteNotification, sendTestNotification };
