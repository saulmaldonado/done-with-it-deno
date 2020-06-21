import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { isEmail, isString, isName } from './typeCheckers.ts';
import { AuthRegisterBody, AuthLoginBody } from './bodySchema.ts';

export type guard<T> = (body: T) => body is T;

export const authRegisterBodyGuard: guard<AuthRegisterBody> = (body): body is AuthRegisterBody => {
  const size = 3;
  return (
    isName(body.name) &&
    isString(body.password) &&
    isEmail(body.email) &&
    Object.keys(body).length === size
  );
};

export const authLoginBodyGuard: guard<AuthLoginBody> = (body): body is AuthLoginBody => {
  const size = 2;

  return isEmail(body.email) && isString(body.password) && Object.keys(body).length === size;
};
