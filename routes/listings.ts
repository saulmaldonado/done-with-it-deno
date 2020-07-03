import { Router } from '../deps.ts';
import {
  getAllListings,
  getListingById,
  addListing,
  editListing,
  deleteListing,
} from '../controllers/listings.ts';
import { authenticate } from '../middleware/authenticate.ts';

export default (router: Router, path: string) => {
  // GET api/v1/listings
  router.get(`${path}`, getAllListings);

  // GET api/v1/listings/:id
  router.get(`${path}/:id`, getListingById);

  // POST api/v1/listings
  router.post(`${path}`, authenticate, addListing);

  //PUT /api/v1/listings
  router.put(`${path}/:id`, authenticate, editListing);

  //DELETE /api/v1/listings/:id
  router.delete(`${path}/:id`, authenticate, deleteListing);
};
