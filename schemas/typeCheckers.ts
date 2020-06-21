import { colors } from './cssColors.ts';

export const isString = (string: string) => {
  return string?.length > 0 && typeof string === 'string';
};

export const isNumber = (number: number) => {
  return typeof number === 'number';
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

export const isGeolocation = (location: { latitude: number; longitude: number }) => {
  return (
    isNumber(location.latitude) &&
    isNumber(location.longitude) &&
    location.latitude < 90 &&
    location.latitude > -90 &&
    location.longitude < 180 &&
    location.longitude > -180
  );
};
