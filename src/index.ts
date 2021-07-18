import sqlite from 'sqlite3';

import { decrypt, decryptWindows } from './decrypt';
import { getDerivedKey } from './getDerivedKey';
import { getDomain, getPath } from './util';

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

async function tryGetCookie(
  db: sqlite.Database,
  domain: string,
  cookieName: string,
): Promise<ChromeCookie | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
      (err?: Error, cookie?: ChromeCookie) => {
        if (err) {
          return reject(err);
        }
        return resolve(cookie);
      },
    );
  });
}

function getIterations(): number {
  if (process.platform === 'darwin') return 1003;
  if (process.platform === 'linux') return 1;

  throw new Error(`Platform ${process.platform} is not supported`);
}

export async function getChromeCookie(
  url: string,
  cookieName: string,
): Promise<string | undefined> {
  const path = getPath();
  const domain = getDomain(url);

  const db = new sqlite.Database(path);

  const cookie = await tryGetCookie(db, domain, cookieName);

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
