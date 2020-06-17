import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { readJson } from "https://deno.land/std/fs/read_json.ts";
import { Listing } from "./schema.ts";

const listings: Listing[] = await readJson("./db.json") as Listing[];

const app = new Application();
const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

router.get("/", ({ response }) => {
  response.body = "Welcome to Done With It server";
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
