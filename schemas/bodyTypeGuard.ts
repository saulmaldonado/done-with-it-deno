import {
  isEmail,
  isString,
  isName,
  isColor,
  isNumber,
  isMessage,
  isValidDate,
} from './typeCheckers.ts';
import {
  AuthRegisterBody,
  AuthLoginBody,
  AddCategoryBody,
  SendMessageBody,
  EditUserBody,
  ListingBody,
} from './bodySchema.ts';

import { FormDataFile, RouterContext } from 'https://deno.land/x/oak/mod.ts';

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

export const ListingBodyGuard: guard<ListingBody> = (body): body is ListingBody => {
  const size = 5;

  const { title, price, categoryId, longitude, latitude } = body;

  return (
    isString(title) &&
    isNumber(Number(price)) &&
    isNumber(Number(categoryId)) &&
    isNumber(Number(longitude)) &&
    isNumber(Number(latitude)) &&
    Object.keys(body).length === size
  );
};

export const validateImages = (ctx: RouterContext, images: FormDataFile[]) => {
  if (!images) {
    ctx.throw(400, 'No Files.');
  }

  images.forEach((image) => {
    const supportedContentTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/tiff'];

    if (!image.filename) {
      ctx.throw(400, 'One or more files do not contain a filename');
    } else if (!supportedContentTypes.includes(image.contentType)) {
      ctx.throw(400, 'One or more file type are not supported');
    } else {
      return true;
    }
  });
};

export const editListingBodyGuard: guard<ListingBody> = (body): body is ListingBody => {
  const size = 5;

  const { title, price, categoryId, longitude, latitude } = body;

  return (
    isString(title) &&
    isNumber(price) &&
    isNumber(categoryId) &&
    isNumber(longitude) &&
    isNumber(latitude)
  );
};

export const sendMessageBodyGuard: guard<SendMessageBody> = (body): body is SendMessageBody => {
  const size = 4;

  const { toUserId, listingId, content, dateTime } = body;

  return (
    isNumber(toUserId) &&
    isNumber(listingId) &&
    isMessage(content) &&
    isValidDate(dateTime) &&
    Object.keys(body).length === size
  );
};

export const editUserBodyGuard: guard<EditUserBody> = (body): body is EditUserBody => {
  const size = 3;
  const { name, email, password } = body;
  return isName(name) && isEmail(email) && isString(password) && Object.keys(body).length === size;
};
