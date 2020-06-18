import { Application } from 'https://deno.land/x/oak/mod.ts';
import { notFound } from './middleware/notFound.ts';
import { router } from './routes/root.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Listing } from './schema.ts';

const app = new Application();

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(`Listening on ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`);
});

export const listings: Listing[] = (await readJson('./db.json')) as Listing[];

app.use(router.routes());
app.use(router.allowedMethods());

app.use(notFound);

await app.listen({ port: 8000 });
