import sqlite from 'better-sqlite3';

type MozCookie = {
  name: string;
  value: string;
  host: string;
  path: string;
};

export class FirefoxCookieDatabase {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  findCookie(cookieName: string, domain: string): string | undefined {
    const db = sqlite(this.path, { readonly: true, fileMustExist: true });

    const statement = db.prepare(
      `SELECT value from moz_cookies WHERE name like '${cookieName}' AND host like '%${domain}'`,
    );
    const res = statement.get();
    return res?.value;
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
