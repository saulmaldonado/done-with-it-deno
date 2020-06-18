export type Listing = {
  id: number;
  title: 'string';
  images: { fileName: string }[];
  price: number;
  categoryId: number;
  userId: number;
  location: { latitude: number; longitude: number };
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};
