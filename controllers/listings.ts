import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { addListingBodyGuard, editListingBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { Listing } from '../schemas/schema.ts';
import { validateBody, validateListingBody } from '../schemas/validate.ts';
import { ListingBody } from '../schemas/bodySchema.ts';

const readListings = async () => {
  return (await readJson('./db/listings.json')) as Listing[];
};
const writeListings = async (newListings: Listing[]) => {
  await writeFileStr('./db/listings.json', JSON.stringify(newListings));
};

const listings = await readListings();

const getAllListings = async ({ response }: RouterContext) => {
  response.body = await readListings();
};

type getListingByIdParams = {
  id: string;
};

const getListingById = (ctx: RouterContext<getListingByIdParams>) => {
  const id = ctx.params.id;
  let listing = listings.find((listing) => listing.id === Number(id));

  if (!listing) {
    ctx.throw(404, 'Listing not found');
  } else {
    ctx.response.body = listing;
  }
};

const addListing = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);

  const { title, price, categoryId, longitude, latitude } = await validateListingBody(ctx);

  const dbListings = await readListings();

  const id = dbListings.length + 1;

  const newListing: Listing = {
    id,
    title,
    price,
    categoryId,
    userId,
    location: { longitude, latitude },
  };

  dbListings.push(newListing);

  await writeListings(dbListings);

  ctx.response.body = newListing;
};

type EditListingsParams = {
  id: string;
};

const editListing = async (ctx: RouterContext<EditListingsParams>) => {
  const userId = await getTokenUserId(ctx);
  const listingId = Number(ctx.params.id);

  const dbListings = await readListings();

  const listingIndex = dbListings.findIndex((l) => l.id === listingId);

  if (listingIndex < 0) {
    ctx.throw(404, 'Listing not found.');
  } else if (userId !== dbListings[listingIndex].userId) {
    ctx.throw(403, 'Unauthorized to edit listing');
  } else {
    const { categoryId, latitude, longitude, price, title } = await validateBody<ListingBody>(
      ctx,
      editListingBodyGuard
    );

    const editedListing = {
      title,
      // images,
      price,
      categoryId,
      location: { longitude, latitude },
    };

    dbListings.splice(listingIndex, 1, { ...editedListing, id: listingId, userId: userId });

    await writeListings(dbListings);

    ctx.response.body = { ...editedListing, id: listingId, userId: userId };
  }
};

type DeleteListingsParams = {
  id: string;
};

const deleteListing = async (ctx: RouterContext<DeleteListingsParams>) => {
  const userId = await getTokenUserId(ctx);
  const listingId = Number(ctx.params.id);

  const dbListings = await readListings();

  const listingIndex = dbListings.findIndex((l) => l.id === listingId);

  if (listingIndex < 0) {
    ctx.throw(404, 'Listings not found');
  } else if (userId !== dbListings[listingIndex].userId) {
    ctx.throw(403, 'Unauthorized to delete listing');
  } else {
    dbListings.splice(listingIndex, 1);
    await writeListings(dbListings);

    ctx.response.body = 'Listing deleted.';
  }
};

export { getAllListings, getListingById, addListing, editListing, deleteListing };
