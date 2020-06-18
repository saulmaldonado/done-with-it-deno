import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { listings } from '../index.ts';

const getAllListings = (ctx: RouterContext) => {
  ctx.response.body = listings;
};

const getListingById = (ctx: RouterContext) => {
  let id = Number(ctx.params.id);

  ctx.response.body = listings.find((listing) => listing.id === id);
};

export { getAllListings, getListingById };
