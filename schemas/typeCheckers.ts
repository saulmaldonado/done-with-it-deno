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
