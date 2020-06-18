import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';
import { Listing } from '../schema.ts';

const listings = (await readJson('./db/listings.json')) as Listing[];
const baseUrl = 'http://localhost:8000';

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
