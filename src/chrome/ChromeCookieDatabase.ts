import sqlite from 'better-sqlite3';
import { ChromeCookie, ChromeCookieRepository } from './ChromeCookieRepository';

export class ChromeCookieDatabase implements ChromeCookieRepository {
  constructor(private path: string) {}

  findCookie(cookieName: string, domain: string): ChromeCookie | undefined {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });
    const statement = db.prepare(
      `SELECT host_key, path, name, encrypted_value FROM cookies where host_key like '%${domain}' and name like '%${cookieName}' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
    );
    return statement.get();
  }

  listCookies(): ChromeCookie[] {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });
    const statement = db.prepare(
      `SELECT host_key, path, name, encrypted_value FROM cookies`,
    );
    const cookies: ChromeCookie[] = statement.all();
    return cookies;
  }
}
