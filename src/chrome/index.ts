import { Cookie } from '../types';
import { mergeDefaults } from '../utils';
import { ChromeCookieDatabase } from './ChromeCookieDatabase';

import { decrypt, decryptWindows } from './decrypt';
import { getDerivedKey } from './getDerivedKey';
import { getDomain, getIterations, getCookiesPath } from './util';

const KEYLENGTH = 16;

export interface GetChromeCookiesOptions {
  profile: string;
}

const defaultOptions: GetChromeCookiesOptions = {
  profile: 'Default',
};

/**
 * @deprecated Replaced by getCookie
 */
export async function getChromeCookie(
  url: string,
  cookieName: string,
  options?: Partial<GetChromeCookiesOptions>,
): Promise<string | undefined> {
  const config = mergeDefaults(defaultOptions, options);
  const path = getCookiesPath(config.profile);
  const domain = getDomain(url);

  const db = new ChromeCookieDatabase(path);

  // const cookie = tryGetCookie(path, domain, cookieName);
  const cookie = db.findCookie(cookieName, domain);

  if (!cookie) return undefined;

  if (process.platform === 'darwin' || process.platform === 'linux') {
    const iterations = getIterations();
    const derivedKey = await getDerivedKey(KEYLENGTH, iterations);
    return decrypt(derivedKey, cookie.encrypted_value, KEYLENGTH);
  }

  if (process.platform === 'win32') {
    return decryptWindows(cookie.encrypted_value);
  }

  throw new Error(`Platform ${process.platform} is not supported`);
}

export async function listChromeCookies(
  options?: Partial<GetChromeCookiesOptions>,
): Promise<Cookie[]> {
  const config = mergeDefaults(defaultOptions, options);
  const path = getCookiesPath(config.profile);
  const db = new ChromeCookieDatabase(path);
  const cookies = db.listCookies();
  const decryptedCookies = await Promise.all(
    cookies.map(async (cookie): Promise<Cookie> => {
      if (cookie.value)
        return {
          name: cookie.name,
          host: cookie.host_key,
          path: cookie.path,
          value: cookie.value,
        };
      if (process.platform === 'darwin' || process.platform === 'linux') {
        const iterations = getIterations();
        const derivedKey = await getDerivedKey(KEYLENGTH, iterations);
        const value = decrypt(derivedKey, cookie.encrypted_value, KEYLENGTH);
        return {
          name: cookie.name,
          host: cookie.host_key,
          path: cookie.path,
          value,
        };
      }

      if (process.platform === 'win32') {
        const value = decryptWindows(cookie.encrypted_value);
        return {
          name: cookie.name,
          host: cookie.host_key,
          path: cookie.path,
          value,
        };
      }
      throw new Error('Failed to decrypt cookie');
    }),
  );

  return decryptedCookies;
}
