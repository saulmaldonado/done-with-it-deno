import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import {
  authLoginBodyGuard,
  authRegisterBodyGuard,
  AddCategoryBodyGuard,
  addListingBodyGuard,
} from '../schemas/bodyTypeGuard.ts';
import {
  AuthLoginBody,
  AuthRegisterBody,
  AddCategoryBody,
  AddListingBody,
} from '../schemas/bodySchema.ts';

const mockRequest = (body: any) => {
  return new Promise((res) => {
    setTimeout(() => {
      return res(body);
    }, 500);
  });
};

Deno.test('Login type guard should fail when given invalid body', async () => {
  const body = (await mockRequest({ name: 'sers', password: 5 })) as AuthLoginBody;

  assert(!authLoginBodyGuard(body));
});

Deno.test('Register type guard shuld fail when given invalid body', async () => {
  const body = (await mockRequest({
    name: 'saul',
    password: 1234,
    email: 'saul@examplecom',
  })) as AuthRegisterBody;

  assert(!authRegisterBodyGuard(body));
});

Deno.test('Category type guard should fail when given invalid body', async () => {
  const body = (await mockRequest({
    name: 'Music',
    icon: 1234,
    color: 'redorange',
    backgroundColor: '#ffecd',
  })) as AddCategoryBody;

  assert(!AddCategoryBodyGuard(body));
});

Deno.test('Listings type guard should fail when given invalid body', async () => {
  const body = (await mockRequest({
    title: 'leather shoes',
    images: [{ fileName: 'shoes2' }, { name: 'shoes3' }],
    categoryId: '6',
    price: '100',
    location: { latitude: 90, longitude: -181 },
  })) as AddListingBody;

  assert(!addListingBodyGuard(body));
});
