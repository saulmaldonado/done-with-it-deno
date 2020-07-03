import { RouterContext, FormDataFile } from '../deps.ts';
import { moveImage, thumbnailImage } from '../helpers/image.ts';
import { v4 } from '../deps.ts';

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

export const uploadImages = async (ctx: RouterContext<any>, images: FormDataFile[]) => {
  const imagesDir = './public/assets';

  const imageList = await Promise.all(
    images.map(async (i) => {
      let name = v4.generate(); // generate unique name for images

      try {
        await moveImage(i, imagesDir, name);
        await thumbnailImage(imagesDir, name);
      } catch {
        ctx.throw(400, 'Error uploading image');
      }
      return {
        name: i.originalName,
        full: `${imagesDir}/${name}_full.jpeg`,
        thumbnail: `${imagesDir}/${name}_thumbnail.jpeg`,
      };
    })
  );

  return imageList;
};
