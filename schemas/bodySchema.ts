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

export type ListingBody = {
  title: string;
  images?: any;
  price: number;
  categoryId: number;
  latitude: number;
  longitude: number;
};

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
