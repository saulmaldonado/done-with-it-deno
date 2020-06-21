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
