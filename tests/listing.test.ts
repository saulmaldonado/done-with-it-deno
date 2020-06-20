import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { getTokenUserId, genToken } from '../helpers/jwtAuth.ts';
import { Listing } from '../schema.ts';

const listings = (await readJson('./db/listings.json')) as Listing[];
const baseUrl = 'http://localhost:8000';

const readListings = async () => {
  return (await readJson('./db/listings.json')) as Listing[];
};

const writeListings = async (newListing: Listing[]) => {
  await writeFileStr('./db/listings.json', JSON.stringify(newListing));
};

Deno.test('/api/v1/listings should return all listings', async () => {
  const result = await fetch(baseUrl + '/api/v1/listings/');

  const resultListing = (await result.json()) as Listing[];

  assertEquals(resultListing.length, listings.length);
});

Deno.test('/api/v1/listings/1 should return listing with an id of 1', async () => {
  const result = await fetch(baseUrl + '/api/v1/listings/1');
  const resultListing = (await result.json()) as Listing;

  assert(result.ok);
  assertEquals(resultListing.id, 1);
});

Deno.test('request for invalid listing id should fail', async () => {
  const { ok, body, status } = await fetch(baseUrl + '/api/v1/listings/0');

  assertEquals(ok, false);
  assertEquals(status, 404);

  await body?.cancel();
});

Deno.test('Invalid paths should fail', async () => {
  const { ok, body } = await fetch(baseUrl + '/api/v1/listing');

  assertEquals(ok, false);

  await body?.cancel();
});

Deno.test('New Listing should be added to DB', async () => {
  const testToken = genToken();

  const newListing = {
    title: 'Red jacket',
    images: [{ fileName: 'jacket1' }],
    price: 100,
    categoryId: 5,
    location: { latitude: 37.78825, longitude: -122.4324 },
  };

  const result = await fetch(baseUrl + '/api/v1/listings', {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(newListing),
    method: 'POST',
  });

  assert(result.ok);

  const dbListings = await readListings();

  assertEquals(dbListings[dbListings.length - 1], {
    ...newListing,
    userId: 1,
    id: dbListings.length,
  });

  //cleanup

  dbListings.pop();

  await writeListings(dbListings);

  result.body?.cancel();
});

Deno.test(
  'Sending request for posting listing without userId in JWT payload will fail',
  async () => {
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o';

    const newListing = {
      title: 'Red jacket',
      images: [{ fileName: 'jacket1' }],
      price: 100,
      categoryId: 5,
      location: { latitude: 37.78825, longitude: -122.4324 },
    };

    const result = await fetch(baseUrl + '/api/v1/listings', {
      headers: { Authorization: `Bearer ${invalidToken}` },
      body: JSON.stringify(newListing),
      method: 'POST',
    });

    assert(!result.ok);

    result.body?.cancel();
  }
);

Deno.test('PUT /api/v1/listings/:id, should edit listing by id', async () => {
  const testToken = genToken();
  const listingId = 101;
  const userId = 1;

  const initialState = await readListings();

  const editedListing = {
    title: 'Nikon D850 for sale',
    images: [{ fileName: 'camera2' }],
    price: 3000,
    categoryId: 3,
    location: { latitude: 37.78825, longitude: -122.4324 },
  };

  const result = await fetch(baseUrl + `/api/v1/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(editedListing),
    method: 'PUT',
  });

  assert(result.ok);

  const dbListings = await readListings();

  assertEquals(
    dbListings.find((l) => l.id === listingId),
    { ...editedListing, id: listingId, userId }
  );

  //cleanup

  await writeListings(initialState);
  result.body?.cancel();
});

Deno.test('DELETE /api/listings/:id, should delete listing by id', async () => {
  const testToken = genToken();
  const listingId = 101;

  const initialState = await readListings();

  const result = await fetch(baseUrl + `/api/v1/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  const dbListings = await readListings();

  assert(result.ok);
  assert(!dbListings.some((l) => l.id === listingId));

  //cleanup

  await writeListings(initialState);
  result.body?.cancel();
});

Deno.test('PUT and DELETE /api/v1/listings/:id should if listing id does not exist', async () => {
  const testToken = genToken();
  const invalidListingId = 0;

  const editedListing = {
    title: 'Nikon D850 for sale',
    images: [{ fileName: 'camera2' }],
    price: 3000,
    categoryId: 3,
    location: { latitude: 37.78825, longitude: -122.4324 },
  };

  const putResult = await fetch(baseUrl + `/api/v1/listings/${invalidListingId}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    body: JSON.stringify(editedListing),
    method: 'PUT',
  });

  const deleteResult = await fetch(baseUrl + `/api/v1/listings${invalidListingId}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  assert(!putResult.ok);
  assert(!deleteResult.ok);

  putResult.body?.cancel();
  deleteResult.body?.cancel();
});
