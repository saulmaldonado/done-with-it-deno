import { ImageFile } from '../schemas/schema.ts';
import { ImageMagick, MagickFormat } from 'https://deno.land/x/deno_imagemagick/mod.ts';

export const moveImage = async (image: ImageFile, path: string, name: string) => {
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

export const thumbnailImage = async (image: ImageFile, path: string, name: string) => {
  const img = await Deno.readFile(`${path}/${name}_full.jpeg`);

  ImageMagick.read(img, (img) => {
    img.resize(100, 100);

    img.write(async (data) => {
      await Deno.writeFile(`${path}/${name}_thumbnail.jpeg`, data);
    }, MagickFormat.Jpeg);
  });
};
