import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { genToken } from '../helpers/jwtAuth.ts';
import { Listing } from '../schemas/schema.ts';
import { config } from '../environment.dev.ts';
import { readListings, writeListings } from '../helpers/database.ts';
import { testConfig } from './test.env.ts';

const baseUrl: string = config.BASE_URL;

Deno.test('/api/v1/listings should return all listings', async () => {
  const result = await fetch(baseUrl + '/api/v1/listings/');

  const resultListing = (await result.json()) as Listing[];
  const dbListings = await readListings();

  assertEquals(resultListing.length, dbListings.length);
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
  const testToken = genToken(config.SECRET);

  const formBody = new FormData();

  formBody.append('title', 'Shoes');
  formBody.append(
    'image',
    new Blob([await Deno.readFile('./tests/assets/test.jpg')], { type: 'image/jpeg' }),
    'test'
  );
  formBody.append('price', '100');
  formBody.append('categoryId', '5');
  formBody.append('latitude', '37.78825');
  formBody.append('longitude', '-122.4324');

  const result = await fetch(baseUrl + '/api/v1/listings', {
    headers: { Authorization: `Bearer ${testToken}` },
    body: formBody,
    method: 'POST',
  });

  const dbListings = await readListings();
  const foundListing = dbListings[dbListings.length - 1];

  const resultListing = (await result.json()) as Listing;

  const expectedListing = {
    id: dbListings.length,
    userId: 1,
    title: 'Shoes',
    images: resultListing?.images,
    price: 100,
    categoryId: 5,
    location: {
      longitude: -122.4324,
      latitude: 37.78825,
    },
  };

  assert(result.ok);
  assertEquals(foundListing, expectedListing);

  //cleanup

  dbListings.pop();

  await writeListings(dbListings);

  await Deno.remove(resultListing.images[0].full);
  await Deno.remove(resultListing.images[0].thumbnail);
});

Deno.test(
  'Sending request for posting listing without userId in JWT payload will fail',
  async () => {
    const invalidToken = testConfig.NO_USER_ID;
    const formBody = new FormData();

    formBody.append('title', 'Shoes');
    formBody.append(
      'image',
      new Blob([await Deno.readFile('./tests/assets/test.jpg')], { type: 'image/jpeg' }),
      'test'
    );
    formBody.append('price', '100');
    formBody.append('categoryId', '5');
    formBody.append('latitude', '37.78825');
    formBody.append('longitude', '-122.4324');

    const result = await fetch(baseUrl + '/api/v1/listings', {
      headers: { Authorization: `Bearer ${invalidToken}` },
      body: formBody,
      method: 'POST',
    });

    assert(!result.ok);

    result.body?.cancel();
  }
);

Deno.test('PUT /api/v1/listings/:id, should edit listing by id', async () => {
  const testToken = genToken(config.SECRET);
  const listingId = 1;
  const userId = 1;

  const initialState = await readListings();

  const formBody = new FormData();

  formBody.append('title', 'Nikon D850 for sale');
  formBody.append(
    'image',
    new Blob([await Deno.readFile('./tests/assets/test.jpg')], { type: 'image/jpeg' }),
    'test'
  );

  formBody.append('price', '3000');
  formBody.append('categoryId', '3');
  formBody.append('latitude', '37.78825');
  formBody.append('longitude', '-122.4324');

  const result = await fetch(baseUrl + `/api/v1/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    body: formBody,
    method: 'PUT',
  });

  const resultListing = (await result.json()) as Listing;

  const expectedListing = {
    userId: userId,
    id: listingId,
    title: 'Nikon D850 for sale',
    images: resultListing?.images,
    price: 3000,
    categoryId: 3,
    location: {
      longitude: -122.4324,
      latitude: 37.78825,
    },
  };

  assert(result.ok);

  assertEquals(resultListing, expectedListing);
  //cleanup
  await Deno.copyFile('./tests/assets/camera1_full.jpg', './public/assets/camera1_full.jpg');
  await Deno.copyFile(
    './tests/assets/camera1_thumbnail.jpg',
    './public/assets/camera1_thumbnail.jpg'
  );
  await Deno.remove(resultListing.images[0].full);
  await Deno.remove(resultListing.images[0].thumbnail);
  await writeListings(initialState);
});

Deno.test('DELETE /api/listings/:id, should delete listing by id', async () => {
  const testToken = genToken(config.SECRET);
  const idToDelete = 1;

  const initialState = await readListings();

  const result = await fetch(baseUrl + `/api/v1/listings/${idToDelete}`, {
    headers: { Authorization: `Bearer ${testToken}` },
    method: 'DELETE',
  });

  const dbListings = await readListings();

  assert(result.ok);
  assert(!dbListings.some((l) => l.id === idToDelete));

  //cleanup

  await writeListings(initialState);
  result.body?.cancel();
});

Deno.test(
  'PUT and DELETE /api/v1/listings/:id should fail if listing id does not exist',
  async () => {
    const testToken = genToken(config.SECRET);
    const invalidListingId = 0;

    const formBody = new FormData();

    formBody.append('title', 'Nikon D850 for sale');
    formBody.append(
      'image',
      new Blob([await Deno.readFile('./tests/assets/test.jpg')], { type: 'image/jpeg' }),
      'test'
    );

    formBody.append('price', '3000');
    formBody.append('categoryId', '3');
    formBody.append('latitude', '37.78825');
    formBody.append('longitude', '-122.4324');

    const putResult = await fetch(baseUrl + `/api/v1/listings/${invalidListingId}`, {
      headers: { Authorization: `Bearer ${testToken}` },
      body: formBody,
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
  }
);

Deno.test('Listing with no category should post with null category', async () => {
  const initialState = await readListings();

  const testToken = genToken(config.SECRET);
  const invalidListingId = 0;

  const formBody = new FormData();

  formBody.append('title', 'Nikon D850 for sale');
  formBody.append(
    'image',
    new Blob([await Deno.readFile('./tests/assets/test.jpg')], { type: 'image/jpeg' }),
    'test'
  );

  formBody.append('price', '3000');
  formBody.append('categoryId', ''); // null category
  formBody.append('latitude', '37.78825');
  formBody.append('longitude', '-122.4324');

  const result = await fetch(baseUrl + '/api/v1/listings', {
    headers: { Authorization: `Bearer ${testToken}` },
    body: formBody,
    method: 'POST',
  });

  const newListing = (await result.json()) as Listing;

  assert(result.ok);

  assert(newListing.categoryId === null);

  //clean up

  await writeListings(initialState);
});
