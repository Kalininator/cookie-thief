import sqlite from 'better-sqlite3';

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

export class ChromeCookieDatabase {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  findCookie(cookieName: string, domain: string): ChromeCookie {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });
    const statement = db.prepare(
      `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
    );
    return statement.get();
  }

  listCookies(): ChromeCookie[] {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });
    const statement = db.prepare(
      `SELECT host_key, path, is_secure, expires_utc, name, value, encrypted_value, creation_utc, is_httponly, has_expires, is_persistent FROM cookies`,
    );
    const cookies: ChromeCookie[] = statement.all();
    return cookies;
  }
}
