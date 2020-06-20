import { Router } from 'https://deno.land/x/oak/mod.ts';
import {
  getAllListings,
  getListingById,
  addListing,
  editListing,
} from '../controllers/listings.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  router.get(`${path}`, getAllListings);
  router.get(`${path}/:id`, getListingById);

  // POST api/v1/listings
  router.post(`${path}`, authenticate, addListing);

  //PUT /api/v1/listings
  router.put(`${path}/:id`, authenticate, editListing);
};
