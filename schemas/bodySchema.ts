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

export type AddListingBody = {
  title: string;
  images: { fileName: string }[];
  price: number;
  categoryId: number;
  location: { latitude: number; longitude: number };
};

export type EditListingBody = AddListingBody;

export type SendMessageBody = {
  toUserId: number;
  listingId: number;
  content: string;
  dateTime: number;
};
