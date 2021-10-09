import sqlite from 'better-sqlite3';
import { FirefoxCookieRepository, MozCookie } from './FirefoxCookieRepository';

export class FirefoxCookieDatabase implements FirefoxCookieRepository {
  constructor(private path: string) {}

  findCookie(cookieName: string, domain: string): MozCookie | undefined {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });

    const statement = db.prepare(
      `SELECT name, value, host, path from moz_cookies WHERE name like '${cookieName}' AND host like '%${domain}'`,
    );
    return statement.get();
  }

  listCookies(): MozCookie[] {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });
    const statement = db.prepare(
      `SELECT name, value, host, path from moz_cookies`,
    );
    const res: MozCookie[] = statement.all();
    return res;
  }
}
