import { RouterContext, FormDataReader } from 'https://deno.land/x/oak/mod.ts';
import { ImageFile } from '../schemas/schema.ts';
import { moveImage, thumbnailImage } from '../helpers/image.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

export const uploadImages = async (ctx: RouterContext) => {
  const imagesDir = './public/assets';
  const images = (await ((await ctx.request.body()).value as FormDataReader).read())
    .files as ImageFile[];

  images.forEach(async (i) => {
    let name = v4.generate(); // generate unique name for images
    await moveImage(i, imagesDir, name);

    await thumbnailImage(i, imagesDir, name);
  });

  ctx.response.body = images;
};
