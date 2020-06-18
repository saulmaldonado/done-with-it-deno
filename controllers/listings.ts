import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { listings } from '../index.ts';

const getAllListings = (ctx: RouterContext) => {
  ctx.response.body = listings;
};

const getListingById = (ctx: RouterContext) => {
  ctx.response.body = ctx.params.id;
};

export { getAllListings, getListingById };
