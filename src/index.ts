import { homedir } from 'os';
import sqlite from 'sqlite3';

import keytar from 'keytar';
import { promisify } from 'util';
import crypto from 'crypto';

const ITERATIONS = 1003;
const KEYLENGTH = 16;

function decrypt(key: crypto.CipherKey, encryptedData: Buffer): string {
  const iv = Buffer.from(new Array(KEYLENGTH + 1).join(' '), 'binary');

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(false);

  const data = encryptedData.slice(3);
  let decoded = decipher.update(data);

  const final = decipher.final();
  final.copy(decoded, decoded.length - 1);

  const padding = decoded[decoded.length - 1];
  if (padding) {
    decoded = decoded.slice(0, decoded.length - padding);
  }

  return decoded.toString('utf8');
}

async function getDerivedKey(): Promise<Buffer> {
  const chromePassword = await keytar.getPassword(
    'Chrome Safe Storage',
    'Chrome',
  );
  if (!chromePassword) throw new Error('Could not fetch chrome password');
  const promisedPbkdf2 = promisify(crypto.pbkdf2);
  const res = await promisedPbkdf2(
    chromePassword,
    'saltysalt',
    ITERATIONS,
    KEYLENGTH,
    'sha1',
  );

  return res;
}

async function tryGetCookie(
  db: sqlite.Database,
  domain: string,
  cookieName: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
        (err, cookie) => {
          if (err) {
            return reject(err);
          }
          return resolve(cookie);
        },
      );
    });
  });
}

// eslint-disable-next-line import/prefer-default-export
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

  const derivedKey = await getDerivedKey();

  const value = decrypt(derivedKey, cookie.encrypted_value);

  return value;
}
