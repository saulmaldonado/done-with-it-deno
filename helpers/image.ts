import { ImageFile, Listing } from '../schemas/schema.ts';
import { ImageMagick, MagickFormat } from 'https://deno.land/x/deno_imagemagick/mod.ts';
import { FormDataFile } from 'https://deno.land/x/oak/mod.ts';

// const checkFile = (image: FormDataFile): true | never => {
//   const supportedContentTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/tiff'];

//   if (!image.filename) {
//     throw new Error('No Filename');
//   }

//   if (!supportedContentTypes.includes(image.contentType)) {
//     throw new Error('File type not supported');
//   }

//   return true;
// };

export const moveImage = async (image: FormDataFile, path: string, name: string) => {
  const filename = image.filename as string;
  try {
    await Deno.rename(filename, `${path}/${name}_full.jpeg`);
  } catch (error) {
    try {
      await Deno.copyFile(filename, `${path}/${name}_full.jpeg`);
      await Deno.remove(filename);
    } catch (error) {
      console.error('An error ocurred, image was not uploaded.');
    }
  }
};

export const thumbnailImage = async (path: string, name: string) => {
  const img = await Deno.readFile(`${path}/${name}_full.jpeg`);

  ImageMagick.read(img, (img) => {
    img.resize(100, 100);

    img.write(async (data) => {
      await Deno.writeFile(`${path}/${name}_thumbnail.jpeg`, data);
    }, MagickFormat.Jpeg);
  });
};

export const replaceImages = (images: FormDataFile[], originalListing: Listing) => {
  images.forEach(async (i) => {
    console.log(i.originalName);
    const foundMatchingListing = originalListing.images.find(
      (image) => image.name === i.originalName
    );

    if (foundMatchingListing) {
      try {
        await Deno.remove(foundMatchingListing.full);
        await Deno.remove(foundMatchingListing.thumbnail);
      } catch (error) {
        console.log(error);
      }
    }
  });
};
