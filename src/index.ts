import { homedir } from 'os';
import sqlite from 'sqlite3';

import { decrypt } from './decrypt';
import { getDerivedKey } from './getDerivedKey';

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

function getPath(): string {
  if (process.platform === 'darwin')
    return `${homedir()}/Library/Application Support/Google/Chrome/Default/Cookies`;
  if (process.platform === 'linux')
    return `${homedir()}/.config/google-chrome/Default/Cookies`;
  if (process.platform === 'win32')
    return `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\${'Default'}\\Cookies`;

  throw new Error(`Platform ${process.platform} is not supported`);
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

  const urlObject = new URL(url);
  const { hostname } = urlObject;
  const domain = hostname.replace(/^[^.]+\./g, '');
  const iterations = getIterations();

  const db = new sqlite.Database(path);

  const cookie = await tryGetCookie(db, domain, cookieName);

  if (!cookie) return undefined;

  const derivedKey = await getDerivedKey(KEYLENGTH, iterations);

  const value = decrypt(derivedKey, cookie.encrypted_value, KEYLENGTH);

  return value;
}
