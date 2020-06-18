import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { listings } from '../index.ts';

const getAllListings = ({ response }: RouterContext) => {
  response.body = listings;
};

type getListingByIdParams = {
  id: string;
};

const getListingById = ({
  params: { id },
  response,
  throw: throwError,
}: RouterContext<getListingByIdParams>) => {
  let listing = listings.find((listing) => listing.id === Number(id));

  if (!listing) {
    throwError(404, 'Listing not found');
  } else {
    response.body = listing;
  }
};

export { getAllListings, getListingById };
