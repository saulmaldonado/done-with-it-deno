import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { listings } from '../index.ts';

const getAllListings = (ctx: RouterContext) => {
  ctx.response.body = listings;
};

const getListingById = (ctx: RouterContext) => {
  let id = Number(ctx.params.id);

  let listing = listings.find((listing) => listing.id === id);
  if (!listing) {
    ctx.throw(404, 'Listing not found');
  } else {
    ctx.response.body = listing;
  }
};

export { getAllListings, getListingById };
