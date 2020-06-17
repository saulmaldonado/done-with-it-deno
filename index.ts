import { Application } from "https://deno.land/x/oak/mod.ts";
import { readJson } from "https://deno.land/std/fs/read_json.ts";
import { rootRouter } from "./routes/index.ts";
import { Listing } from "./schema.ts";
import { notFound } from "./middleware/notFound.ts";

const listings: Listing[] = await readJson("./db.json") as Listing[];

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

app.use(notFound);

await app.listen({ port: 8000 });
