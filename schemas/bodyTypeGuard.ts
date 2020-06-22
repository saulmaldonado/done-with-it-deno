import {
  isEmail,
  isString,
  isName,
  isColor,
  isFileArray,
  isNumber,
  isGeolocation,
  isMessage,
  isValidDate,
} from './typeCheckers.ts';
import {
  AuthRegisterBody,
  AuthLoginBody,
  AddCategoryBody,
  AddListingBody,
  EditListingBody,
  SendMessageBody,
  EditUserBody,
} from './bodySchema.ts';

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

export const editListingBodyGuard: guard<EditListingBody> = (body): body is EditListingBody => {
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
