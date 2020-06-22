import { ImageFile } from '../schemas/schema.ts';
import { ImageMagick, MagickFormat } from 'https://deno.land/x/deno_imagemagick/mod.ts';

export const thumbnailImage = async (image: ImageFile, path: string) => {
  let name = image.originalName.split('.')[0];
  const img = await Deno.readFile(`${path}/${name}_full.jpeg`);

  ImageMagick.read(img, (img) => {
    img.resize(100, 100);

    img.write(async (data) => {
      await Deno.writeFile(`${path}/${name}_thumbnail.jpeg`, data);
    }, MagickFormat.Jpeg);
  });
};

export const moveImage = async (image: ImageFile, path: string) => {
  let name = image.originalName.split('.')[0];
  try {
    await Deno.rename(image.filename, `${path}/${name}_full.jpeg`);
  } catch (error) {
    try {
      await Deno.copyFile(image.filename, `${path}/${name}_full.jpeg`);
      await Deno.remove(image.filename);
    } catch (error) {
      console.error('An error ocurred, image was not uploaded.');
    }
  }
};
