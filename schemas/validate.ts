import { RouterContext, FormDataReader } from 'https://deno.land/x/oak/mod.ts';
import { guard, addListingBodyGuard } from './bodyTypeGuard.ts';
import { ListingBody } from './bodySchema.ts';
import { uploadImages } from '../controllers/images.ts';
import { FormDataImage } from '../controllers/images.ts';

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

  const bodyFields = (body.fields as unknown) as ListingBody;

  const bodyFiles = body.files as FormDataImage[];

  if (!bodyFiles) {
    ctx.throw(400, 'Image files not not included.');
  }

  if (!addListingBodyGuard(bodyFields)) {
    ctx.throw(400, 'Invalid Type');
  }

  const imagesList = await uploadImages(ctx, bodyFiles);

  const { title, price, categoryId, longitude, latitude } = bodyFields;

  return {
    title,
    images: imagesList,
    price: Number(price),
    categoryId: Number(categoryId),
    longitude: Number(longitude),
    latitude: Number(latitude),
  };
};
