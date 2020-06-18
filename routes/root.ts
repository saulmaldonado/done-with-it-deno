import { Router, RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { listingRoutes } from './listings.ts';

export const ROOT_PATH = '/api/v1';

export const router = new Router({ prefix: ROOT_PATH });

const response = ({ response, request }: RouterContext) => {
  response.body = request.url.pathname;
};

// GET /api/v1/
router.get('/', response);

// GET /api/v1/accounts
router.get('/accounts', response);

// subRouter /api/v1/listings*
listingRoutes(router, '/listings');

// GET /api/v1/auth
router.get('/auth', response);

// GET /api/v1/messages
router.get('/messages', response);

// GET /api/v1/users
router.get('/users', response);
