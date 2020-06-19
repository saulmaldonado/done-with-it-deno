import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAllMessagesForUser } from '../controllers/messages.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, authenticate, getAllMessagesForUser);
};
