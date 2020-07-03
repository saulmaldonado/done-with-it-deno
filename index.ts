import { Application } from './deps.ts';
import { notFound } from './middleware/notFound.ts';
import { router } from './routes/root.ts';
import { initializeImageMagick } from './deps.ts';
import { config } from './environment.dev.ts';
import { serverStatic } from './middleware/static.ts';

const port: number = config.PORT_NUMBER;
const hostname: string = config.HOST_NAME;

const app = new Application();
await initializeImageMagick(); // image resizer

//log server start up
app.addEventListener('listen', ({ port, secure }) => {
  console.log(`Listening on ${secure ? 'https://' : 'http://'}${hostname ?? 'localhost'}:${port}`);
});
// Routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serverStatic);

//Catch invalid path
app.use(notFound);
await app.listen({ port });
