import { colors } from './cssColors.ts';

export const isString = (string: string) => {
  return string?.length > 0 && typeof string === 'string';
};

export const isNumber = (number: number) => {
  return !isNaN(number);
};

export const isBoolean = (boolean: boolean) => {
  return typeof boolean === 'boolean';
};

export const isEmail = (email: string) => {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;

  return isString(email) && emailRegex.test(email);
};

export const isName = (name: string) => {
  const nameRegex = /^[a-z ,.'-]+$/i;

  return isString(name) && nameRegex.test(name);
};

export const isColor = (color: string) => {
  const cssColors = Object.keys(colors);
  const hexCodeRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  return isString(color) && (cssColors.includes(color) || hexCodeRegex.test(color));
};

export const isFile = (file: string) => {
  const fileRegex = /[A-Za-z0-9-_]+/;
  return isString(file) && fileRegex.test(file);
};

export const isFileArray = (files: { fileName: string }[]) => {
  for (let i = 0; i < files.length; i++) {
    if (!isFile(files[i]?.fileName)) {
      return false;
    }
  }
  return true;
};

export const isGeolocation = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  latitude = Number(latitude);
  longitude = Number(longitude);

  return (
    isNumber(latitude) &&
    isNumber(longitude) &&
    latitude < 90 &&
    latitude > -90 &&
    longitude < 180 &&
    longitude > -180
  );
};

export const isMessage = (content: string) => {
  return isString(content) && content.length < 700;
};

/**
 * Validator will only accept messages timestamped within 10 seconds of the current time.
 */
export const isValidDate = (date: number) => {
  const currentTime = new Date().getTime();
  const timeLimit = 1000 * 10;

  return isNumber(date) && currentTime - date < timeLimit;
};
