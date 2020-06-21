import { assertEquals, assert } from 'https://deno.land/std/testing/asserts.ts';
import { authLoginBodyGuard, authRegisterBodyGuard } from '../schemas/bodyTypeGuard.ts';
import { AuthLoginBody, AuthRegisterBody } from '../schemas/bodySchema.ts';

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
