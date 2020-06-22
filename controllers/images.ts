import { RouterContext, FormDataReader } from 'https://deno.land/x/oak/mod.ts';
import { ImageFile } from '../schemas/schema.ts';
import { moveImage, thumbnailImage } from '../helpers/image.ts';

export const uploadImages = async (ctx: RouterContext) => {
  const imagesDir = './public/assets';
  const images = (await ((await ctx.request.body()).value as FormDataReader).read())
    .files as ImageFile[];

  images.forEach(async (i) => {
    await moveImage(i, imagesDir);

    await thumbnailImage(i, imagesDir);
  });

  ctx.response.body = images;
};
