import { RouterContext, FormDataReader, FormDataFile } from '../deps.ts';
import { guard, ListingBodyGuard, validateImages } from './bodyTypeGuard.ts';
import { ListingBody } from './bodySchema.ts';

/**
 * Checks if request body is present.
 * If body is not present server will throw
 * a 400 Error
 * @param {RouterContext} ctx
 */
export const checkForBody = ({ request, throw: throwError }: RouterContext) => {
  if (!request.hasBody) {
    throwError(400, 'Authentication body not provided.');
  }
};

export const validateBody = async <T>(
  ctx: RouterContext<any>,
  typeGuard: guard<any>
): Promise<T> => {
  const body = (await ctx.request.body({ contentTypes: { json: ['text'] } })).value;

  if (!typeGuard(body)) {
    ctx.throw(400, 'Invalid Type');
  }
  return body;
};

export const validateListingBody = async (ctx: RouterContext<any>): Promise<ListingBody> => {
  const body = await ((await ctx.request.body({ contentTypes: { formData: ['text'] } }))
    .value as FormDataReader).read();

  // const bodyFields = body.fields as ListingBody;
  const bodyFields = body.fields as Omit<ListingBody, 'images'>;

  const bodyFiles = body.files as FormDataFile[];

  if (!bodyFiles) {
    ctx.throw(400, 'Image files not not included.');
  }

  if (!ListingBodyGuard(bodyFields)) {
    ctx.throw(400, 'Invalid Type');
  }

  validateImages(ctx, bodyFiles);

  const { title, price, categoryId, longitude, latitude } = bodyFields;

  return {
    title,
    images: bodyFiles,
    price: price,
    categoryId: categoryId,
    longitude: longitude,
    latitude: latitude,
  };
};
