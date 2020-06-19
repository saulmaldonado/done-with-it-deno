import { Application } from 'https://deno.land/x/oak/mod.ts';
import { notFound } from './middleware/notFound.ts';
import { router } from './routes/root.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Listing, User, Message, Category } from './schema.ts';

import { hash, verify } from 'https://deno.land/x/argon2/lib/mod.ts';
import { encode, decode } from 'https://deno.land/std@0.56.0/encoding/utf8.ts';

// let salt = crypto.getRandomValues(new Uint8Array(12));
let salt = crypto.getRandomValues(new Uint8Array(20));

let secret = encode('my-super-secret');

let passHash = await hash('password');
verify(passHash, 'password').then(console.log);

const app = new Application();

//Mock Database
export const listings: Listing[] = (await readJson('./db/listings.json')) as Listing[];
export const users: User[] = (await readJson('./db/users.json')) as User[];
export const messages: Message[] = (await readJson('./db/messages.json')) as Message[];
export const categories: Category[] = (await readJson('./db/categories.json')) as Category[];

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
