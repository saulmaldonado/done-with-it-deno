import { RouterContext, FormDataReader } from 'https://deno.land/x/oak/mod.ts';
import { guard, addListingBodyGuard } from './bodyTypeGuard.ts';
import { ListingBody } from './bodySchema.ts';

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
  const body = ((
    await ((await ctx.request.body({ contentTypes: { formData: ['text'] } }))
      .value as FormDataReader).read()
  ).fields as unknown) as ListingBody;

  if (!addListingBodyGuard(body)) {
    ctx.throw(400, 'Invalid Type');
  }

  const { title, price, categoryId, longitude, latitude } = body;
  return {
    title,
    price: Number(price),
    categoryId: Number(categoryId),
    longitude: Number(longitude),
    latitude: Number(latitude),
  };
};
