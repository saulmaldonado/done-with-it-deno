import {
  isEmail,
  isString,
  isName,
  isColor,
  isFileArray,
  isNumber,
  isGeolocation,
} from './typeCheckers.ts';
import { AuthRegisterBody, AuthLoginBody, AddCategoryBody, AddListingBody } from './bodySchema.ts';

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

/**
 *
 * TODO Add custom validations for icon (MaterialCommunityIcons)
 *
 */
export const AddCategoryBodyGuard: guard<AddCategoryBody> = (body): body is AddCategoryBody => {
  const size = 4;

  const { name, icon, color, backgroundColor } = body;

  return (
    isString(name) &&
    isString(icon) &&
    isColor(color) &&
    isColor(backgroundColor) &&
    Object.keys(body).length === size
  );
};

export const addListingBodyGuard: guard<AddListingBody> = (body): body is AddListingBody => {
  const size = 5;

  const { title, images, price, categoryId, location } = body;

  return (
    isString(title) &&
    isFileArray(images) &&
    isNumber(price) &&
    isNumber(categoryId) &&
    isGeolocation(location) &&
    Object.keys(body).length === size
  );
};
