import { Router } from 'https://deno.land/x/oak/mod.ts';
import { readJson } from 'https://deno.land/std/fs/read_json.ts';
import { Listing } from '../schema.ts';
import { getAllListings, getListingById } from '../controllers/listings.ts';

export const listingRoutes = (router: Router, path: string) => {
  router.get(`${path}/`, getAllListings);
  router.get(`${path}/:id`, getListingById);
};
