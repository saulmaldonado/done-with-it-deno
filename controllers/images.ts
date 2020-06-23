import { RouterContext } from 'https://deno.land/x/oak/mod.ts';
import { moveImage, thumbnailImage } from '../helpers/image.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

/**
 *
 * @param {RouterContext} ctx
 * @returns {{full: string, thumbnail: string}[]} // relative paths
 */

export type FormDataImage = {
  contentType: string;
  name: string;
  filename: string;
  originalName: string;
};

export const uploadImages = async (ctx: RouterContext, images: FormDataImage[]) => {
  const imagesDir = './public/assets';

  const imageList = await Promise.all(
    images.map(async (i) => {
      let name = v4.generate(); // generate unique name for images

      try {
        await moveImage(i, imagesDir, name);
        await thumbnailImage(i, imagesDir, name);
      } catch (error) {
        ctx.throw(500, 'Error uploading images.');
      }
      return {
        full: `${imagesDir}/${name}_full.jpeg`,
        thumbnail: `${imagesDir}/${name}_thumbnail.jpeg`,
      };
    })
  );

  return imageList;
};
