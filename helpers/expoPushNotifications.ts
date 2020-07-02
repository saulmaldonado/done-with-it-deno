import { gzipEncode } from 'https://github.com/manyuanrong/wasm_gzip/raw/master/mod.ts'; // compressor for notification body
import { config } from '../environment.dev.ts';

const endpoint = config.EXPO_NOTIFICATION_ENDPOINT;

const headers: Record<string, string> = {
  host: 'expo.host',
  accept: 'application/json',
  'accept-encoding': 'gzip',
  'content-encoding': 'gzip',
  'content-type': 'application/json',
};

/**
 * Sends an Expo push notification to the targetToken device
 * with the following body
 * @param {string} targetToken
 * @param {Omit<ExpoPushMessage, 'to'>} body
 */
const sendNotification = async (
  targetToken: string,
  body: Omit<ExpoPushMessage, 'to'>
): Promise<void | never> => {
  if (!isExpoPushToken(targetToken)) {
    throw new Error('Invalid ExpoPushToken');
  } else {
    // compressing to gzip
    const encoder = new TextEncoder();
    const encodedBody = encoder.encode(JSON.stringify({ ...body, to: targetToken }));
    const compressedBody = gzipEncode(encodedBody);

    await fetch(endpoint, {
      headers,
      method: 'POST',
      body: compressedBody,
    });
  }
};

// types from https://github.com/expo/expo-server-sdk-node/blob/master/src/ExpoClient.ts

type ExpoPushToken = string;

const isExpoPushToken = (token: string): token is ExpoPushToken => {
  return (
    typeof token === 'string' &&
    (((token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
      token.endsWith(']')) ||
      /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token))
  );
};

type ExpoPushMessage = {
  to: ExpoPushToken | ExpoPushToken[];
  data?: object;
  title?: string;
  subtitle?: string;
  body?: string;
  sound?:
    | 'default'
    | null
    | {
        critical?: boolean;
        name?: 'default' | null;
        volume?: number;
      };
  ttl?: number;
  expiration?: number;
  priority?: 'default' | 'normal' | 'high';
  badge?: number;
  channelId?: string;
};

export { ExpoPushMessage, ExpoPushToken, sendNotification };
