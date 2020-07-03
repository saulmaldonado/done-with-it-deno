import { RouterContext } from '../deps.ts';
import { getTokenUserId } from '../helpers/jwtAuth.ts';
import { Listing } from '../schemas/schema.ts';
import { validateListingBody } from '../schemas/validate.ts';
import { uploadImages } from './images.ts';
import { replaceImages, imageMapper } from '../helpers/image.ts';
import { readListings, writeListings } from '../helpers/database.ts';
import {
  getListingByIdParams,
  EditListingsParams,
  DeleteListingsParams,
} from '../schemas/paramsSchema.ts';

const getAllListings = async ({ response }: RouterContext) => {
  const listings = await readListings();

  listings.forEach(imageMapper);

  response.body = listings;
};

const getListingById = async (ctx: RouterContext<getListingByIdParams>) => {
  const listings = await readListings();

  const id = ctx.params.id;
  let listing = listings.find((listing) => listing.id === Number(id));

  if (!listing) {
    ctx.throw(404, 'Listing not found');
  } else {
    imageMapper(listing);
    ctx.response.body = listing;
  }
};

const addListing = async (ctx: RouterContext) => {
  const userId = await getTokenUserId(ctx);

  const { title, price, categoryId, longitude, latitude, images } = await validateListingBody(ctx);
  const imagesList = await uploadImages(ctx, images);

  const dbListings = await readListings();

  const id = dbListings.length + 1;

  const newListing: Listing = {
    id,
    title,
    images: imagesList,
    price: Number(price),
    categoryId: categoryId ? Number(categoryId) : null,
    userId,
    location: { longitude: Number(longitude), latitude: Number(latitude) },
  };

  dbListings.push(newListing);

  await writeListings(dbListings);

  ctx.response.body = newListing;
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
    const { title, price, categoryId, longitude, latitude, images } = await validateListingBody(
      ctx
    );

    const originalListing = dbListings[listingIndex];

    replaceImages(images, originalListing);

    const imagesList = await uploadImages(ctx, images);

    const editedListing = {
      title,
      images: imagesList,
      price: Number(price),
      categoryId: categoryId ? Number(categoryId) : null,
      userId,
      location: { longitude: Number(longitude), latitude: Number(latitude) },
    };

    dbListings.splice(listingIndex, 1, { ...editedListing, id: listingId, userId: userId });

    await writeListings(dbListings);

    ctx.response.body = { ...editedListing, id: listingId, userId: userId };
  }
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
