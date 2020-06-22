import { Application } from 'https://deno.land/x/oak/mod.ts';
import { notFound } from './middleware/notFound.ts';
import { router } from './routes/root.ts';
import { readJson, writeFileStr, readFileStr } from 'https://deno.land/std/fs/mod.ts';
import { Listing, User, Message, Category, loggedOutToken } from './schemas/schema.ts';
import { initializeImageMagick } from 'https://deno.land/x/deno_imagemagick/mod.ts';

const app = new Application();
await initializeImageMagick();

//Mock Database
export const listings: Listing[] = (await readJson('./db/listings.json')) as Listing[];
export const users: User[] = (await readJson('./db/users.json')) as User[];
export const messages: Message[] = (await readJson('./db/messages.json')) as Message[];
export const categories: Category[] = (await readJson('./db/categories.json')) as Category[];
export const loggedOutTokens: loggedOutToken[] = (await readJson(
  './db/loggedOutTokens.json'
)) as loggedOutToken[];

//log server start up
app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`);
});

// Routes
app.use(router.routes());
app.use(router.allowedMethods());

//Catch invalid path
app.use(notFound);

await app.listen({ port: 8000 });
