import { Router, RouterContext } from 'https://deno.land/x/oak/mod.ts';
import listingRoutes from './listings.ts';
import userRoutes from './users.ts';
import messageRoutes from './messages.ts';
import categoryRoutes from './categories.ts';

export const ROOT_PATH = '/api/v1';

export const router = new Router({ prefix: ROOT_PATH });

const response = ({ response, request }: RouterContext) => {
  response.body = request.url.pathname;
};

//  /api/v1/
router.get('/', response);

// /api/v1/accounts
router.get('/accounts', response);

// subRouter /api/v1/listings*
listingRoutes(router, '/listings');

// subRouter /api/v1/users
userRoutes(router, '/users');

// subRouter /api/v1/categories
categoryRoutes(router, '/categories');

//  /api/v1/auth
router.get('/auth', response);

//  /api/v1/messages
messageRoutes(router, '/messages');
