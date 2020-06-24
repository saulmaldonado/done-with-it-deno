import { assert, assertThrows } from 'https://deno.land/std/testing/asserts.ts';
import {
  authLoginBodyGuard,
  authRegisterBodyGuard,
  AddCategoryBodyGuard,
  sendMessageBodyGuard,
  editUserBodyGuard,
  ListingBodyGuard,
  validateImages,
} from '../schemas/bodyTypeGuard.ts';
import {
  AuthLoginBody,
  AuthRegisterBody,
  AddCategoryBody,
  SendMessageBody,
  EditUserBody,
  ListingBody,
} from '../schemas/bodySchema.ts';
import { FormDataImage } from '../controllers/images.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

const mockRequest = (body: any) => {
  return new Promise((res) => {
    setTimeout(() => {
      return res(body);
    }, 300);
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
    categoryId: '6',
    price: '100',
    location: { latitude: 90, longitude: -181 },
  })) as ListingBody;

  assert(!ListingBodyGuard(body));
});

Deno.test('Image validator should throw given unsupported image type', async () => {
  const mockRouterContext = {
    throw(status: number, message: string) {
      throw new Error('Image Error');
    },
  } as RouterContext;

  const body = (await mockRequest([
    {
      filename: 'test',
      contentType: 'image/gif',
      test: 'test',
      originalName: 'test.gif',
    },
  ])) as FormDataImage[];

  assertThrows(() => validateImages(mockRouterContext, body));
});

Deno.test('Send message type gaurd should fail when given invalid body', async () => {
  const body = (await mockRequest({
    toUserId: 1,
    listingId: '1', //string id
    content: 'Please give me money',
    dateTime: 1592759692295, //invalid time
  })) as SendMessageBody;

  assert(!sendMessageBodyGuard(body));
});

Deno.test('Edit user type guard should fail when given invalid body', async () => {
  const body = (await mockRequest({
    name: 'Saul',
    email: 'saul@domaincom', // invalid email
    password: 1234, // invalid password
  })) as EditUserBody;

  assert(!editUserBodyGuard(body));
});
