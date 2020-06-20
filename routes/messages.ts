import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAllMessagesForUser, sendMessage } from '../controllers/messages.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, authenticate, getAllMessagesForUser);

  //POST /api/v1/messages {toUserId, listingId, content, dateTime}
  router.post(`${path}`, authenticate, sendMessage);

  /**
   * TODO Add endpoints for deleting and editing messages accessible to admins only
   */
};
