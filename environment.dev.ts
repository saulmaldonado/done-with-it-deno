import { config as dotenv } from './deps.ts';

const env = dotenv() as {
  PORT_NUMBER: string;
  HOST_NAME: string;
  BASE_URL: string;
  SECRET: string;
  TEST_SECRET: string;
  TOKEN_ISS: string;
  ACCESS_TOKEN_EXP: string;
  REFRESH_TOKEN_EXP: string;
};

export const config = {
  PORT_NUMBER: Number(env.PORT_NUMBER),
  BASE_URL: env.BASE_URL,
  HOST_NAME: env.HOST_NAME,
  SECRET: env.SECRET,
  TEST_SECRET: env.TEST_SECRET,
  ACCESS_TOKEN_EXP: Number(env.ACCESS_TOKEN_EXP),
  REFRESH_TOKEN_EXP: Number(env.REFRESH_TOKEN_EXP),
  TOKEN_ISS: env.TOKEN_ISS,
  EXPO_NOTIFICATION_ENDPOINT: 'https://exp.host/--/api/v2/push/send',
};
