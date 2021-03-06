import { Router } from '../deps.ts';
import listingRoutes from './listings.ts';
import userRoutes from './users.ts';
import messageRoutes from './messages.ts';
import categoryRoutes from './categories.ts';
import authRoutes from './auth.ts';
import notificationsRoutes from './notifications.ts';

export const ROOT_PATH = '/api/v1';

export const router = new Router({ prefix: ROOT_PATH });

// subRouter /api/v1/listings
listingRoutes(router, '/listings');

// subRouter /api/v1/users
userRoutes(router, '/users');

// subRouter /api/v1/categories
categoryRoutes(router, '/categories');

//  /api/v1/auth
authRoutes(router, '/auth');

//  /api/v1/messages
messageRoutes(router, '/messages');

// /api/v1/notifications
notificationsRoutes(router, '/notifications');
