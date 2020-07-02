import { Router } from 'https://deno.land/x/oak/mod.ts';
import { authenticateAdmin } from '../middleware/isAdmin.ts';
import { deleteNotification, addNotifications } from '../controllers/notifications.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  // PUT /api/v1/notifications
  router.put(path, authenticate, addNotifications);

  // DELETE /api/v1/notifications
  router.delete(path, authenticate, deleteNotification);
};
