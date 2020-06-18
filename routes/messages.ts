import { Router } from 'https://deno.land/x/oak/mod.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { getAllMessagesForUser } from '../controllers/messages.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, getAllMessagesForUser);
};
