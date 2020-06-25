import { ImageFile, Listing } from '../schemas/schema.ts';
import { ImageMagick, MagickFormat } from 'https://deno.land/x/deno_imagemagick/mod.ts';
import { FormDataFile } from 'https://deno.land/x/oak/mod.ts';
import { config } from '../environment.dev.ts';

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

/**
 * Changes the paths of each full and thumbnail image for a listing
 * to the servers baseURL in config
 * ex. ./public/assests/image.jpg to http://192.168.28.196/assets/image.jpg
 * @param {listing} listing
 */
export const imageMapper = (listing: Listing) => {
  listing.images.forEach((i) => {
    i.full = i.full.replace(/.\/public/, config.BASE_URL);
    i.thumbnail = i.thumbnail.replace(/.\/public/, config.BASE_URL);
  });
};
