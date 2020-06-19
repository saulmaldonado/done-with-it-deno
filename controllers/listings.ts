import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { Listing } from '../schema.ts';

const readListings = async () => {
  return (await readJson('./db/listings.json')) as Listing[];
};

const writeListings = async (newListings: Listing[]) => {
  await writeFileStr('./db/listings.json', JSON.stringify(newListings));
};

const listings = await readListings();

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

const addListing = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);

  const { title, images, price, categoryId, location } = (
    await ctx.request.body({ contentTypes: { json: ['text'] } })
  ).value as Omit<Listing, 'userId' | 'id'>;

  const dbListings = await readListings();

  const id = dbListings.length + 1;

  const newListing: Listing = { id, title, images, price, categoryId, userId, location };

  dbListings.push(newListing);

  await writeListings(dbListings);

  ctx.response.body = newListing;
};

export { getAllListings, getListingById, addListing };
