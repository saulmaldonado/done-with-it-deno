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

export type Message = {
  fromUserId: number;
  toUserId: number;
  listingId: number;
  content: string;
  id: number;
  dateTime: Date;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  backgroundColor: string;
  color: string;
};

export type loggedOutToken = {
  refreshToken: string;
};
