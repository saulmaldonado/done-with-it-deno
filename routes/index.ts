import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";

const ROOT = "/api/v1";

export const rootRouter = new Router({ prefix: ROOT });

const response = ({ response, request }: RouterContext) => {
  response.body = request.url.pathname;
};

rootRouter.get("/", response);
rootRouter.get("/accounts", response);
rootRouter.get("/auth", response);
rootRouter.get("/listings", response);
rootRouter.get("/messages", response);
rootRouter.get("/users", response);
