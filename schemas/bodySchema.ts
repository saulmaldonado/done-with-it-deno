import { FormDataFile } from 'https://deno.land/x/oak/mod.ts';

export type AuthRegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type AuthLoginBody = {
  email: string;
  password: string;
};

export type AddCategoryBody = {
  name: string;
  icon: string;
  backgroundColor: string;
  color: string;
};

export interface ListingBody extends Record<string, any> {
  title: string;
  images: FormDataFile[];
  price: string;
  categoryId: string;
  latitude: string;
  longitude: string;
}

export type SendMessageBody = {
  toUserId: number;
  listingId: number;
  content: string;
  dateTime: number;
};

export type EditUserBody = {
  name: string;
  email: string;
  password: string;
};

export type AddNotificationBody = {
  token: string;
};
