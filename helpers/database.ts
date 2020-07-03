import { readJson, writeFileStr } from '../deps.ts';
import { Category, Listing, loggedOutToken, Message, User } from '../schemas/schema.ts';

enum paths {
  CATEGORIES = './db/categories.json',
  LISTINGS = './db/listings.json',
  TOKENS = './db/loggedOutTokens.json',
  MESSAGES = './db/messages.json',
  USERS = './db/users.json',
}

export const readCategories = async () => {
  return (await readJson(paths.CATEGORIES)) as Category[];
};

export const writeCategories = async (newCategories: Category[]) => {
  await writeFileStr(paths.CATEGORIES, JSON.stringify(newCategories));
};
export const readListings = async () => {
  return (await readJson(paths.LISTINGS)) as Listing[];
};

export const writeListings = async (newListings: Listing[]) => {
  await writeFileStr(paths.LISTINGS, JSON.stringify(newListings));
};
export const readLoggedOutTokens = async () => {
  return (await readJson(paths.TOKENS)) as loggedOutToken[];
};

export const writeLoggedOutTokens = async (newTokens: loggedOutToken[]) => {
  await writeFileStr(paths.TOKENS, JSON.stringify(newTokens));
};
export const readMessages = async () => {
  return (await readJson(paths.MESSAGES)) as Message[];
};

export const writeMessages = async (newMessages: Message[]) => {
  await writeFileStr(paths.MESSAGES, JSON.stringify(newMessages));
};
export const readUsers = async () => {
  return (await readJson(paths.USERS)) as User[];
};

export const writeUsers = async (newUsers: User[]) => {
  await writeFileStr(paths.USERS, JSON.stringify(newUsers));
};
