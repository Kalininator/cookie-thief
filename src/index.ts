import { homedir } from 'os';
import sqlite from 'sqlite3';

import { decrypt } from './decrypt';
import { getDerivedKey } from './getDerivedKey';

const ITERATIONS = 1003;
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
    db.serialize(() => {
      db.get(
        `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
        (err?: Error, cookie?: ChromeCookie) => {
          if (err) {
            return reject(err);
          }
          return resolve(cookie);
        },
        () => {
          db.close((err) => {
            if (err) throw err;
            console.log('Closed');
          });
        },
      );
    });
  });
}

export async function getCookie(
  url: string,
  cookieName: string,
): Promise<string | undefined> {
  const path = `${homedir()}/Library/Application Support/Google/Chrome/Default/Cookies`;

  const urlObject = new URL(url);
  const { hostname } = urlObject;
  const domain = hostname.replace(/^[^.]+\./g, '');

  const db = new sqlite.Database(path);

  const cookie = await tryGetCookie(db, domain, cookieName);

  if (!cookie) return undefined;

  const derivedKey = await getDerivedKey(KEYLENGTH, ITERATIONS);

  const value = decrypt(derivedKey, cookie.encrypted_value, KEYLENGTH);

  return value;
}
