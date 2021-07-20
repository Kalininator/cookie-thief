import sqlite from 'better-sqlite3';

import { decrypt, decryptWindows } from './decrypt';
import { getDerivedKey } from './getDerivedKey';
import { getDomain, getIterations, getPath } from './util';

const KEYLENGTH = 16;

type BooleanNumber = 0 | 1;

export type ChromeCookie = {
  host_key: string;
  path: string;
  is_secure: BooleanNumber;
  expires_utc: number;
  name: string;
  value: string;
  encrypted_value: Buffer;
  creation_utc: number;
  is_httponly: BooleanNumber;
  has_expires: BooleanNumber;
  is_persistent: BooleanNumber;
};

function tryGetCookie(
  path: string,
  domain: string,
  cookieName: string,
): ChromeCookie | undefined {
  const db = sqlite(path, { readonly: true, fileMustExist: true });
  const statement = db.prepare(
    `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
  );
  return statement.get();
}

export async function getChromeCookie(
  url: string,
  cookieName: string,
): Promise<string | undefined> {
  const path = getPath();
  const domain = getDomain(url);

  const cookie = tryGetCookie(path, domain, cookieName);

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
