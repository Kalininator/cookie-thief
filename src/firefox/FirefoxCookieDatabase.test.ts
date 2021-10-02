import * as sqlite from 'better-sqlite3';
import { FirefoxCookieDatabase } from './FirefoxCookieDatabase';

jest.mock('better-sqlite3');

describe('FirefoxCookieDatabase', () => {
  it('get single cookie', () => {
    const getFn = jest.fn().mockReturnValue({ value: 'foo' });
    const prepareFn = jest.fn().mockReturnValue({ get: getFn });
    (sqlite as unknown as jest.Mock).mockReturnValue({
      prepare: prepareFn,
    });

    const path = '/some/path/db.sqlite';

    const db = new FirefoxCookieDatabase(path);

    const cookie = db.findCookie('someCookie', '.domain.com');

    expect(cookie).toEqual({ value: 'foo' });
    expect(getFn).toHaveBeenCalled();
    expect(prepareFn).toHaveBeenCalledWith(
      "SELECT name, value, host, path from moz_cookies WHERE name like 'someCookie' AND host like '%.domain.com'",
    );
    expect(sqlite as unknown as jest.Mock).toHaveBeenCalledWith(path, {
      readonly: true,
      fileMustExist: true,
    });
  });

  it('get all cookies', () => {
    const allFn = jest.fn().mockReturnValue([{ value: 'foo' }]);
    const prepareFn = jest.fn().mockReturnValue({ all: allFn });
    (sqlite as unknown as jest.Mock).mockReturnValue({
      prepare: prepareFn,
    });

    const path = '/some/path/db.sqlite';

    const db = new FirefoxCookieDatabase(path);

    const cookie = db.listCookies();

    expect(cookie).toEqual([{ value: 'foo' }]);
    expect(allFn).toHaveBeenCalled();
    expect(prepareFn).toHaveBeenCalledWith(
      'SELECT name, value, host, path from moz_cookies',
    );
    expect(sqlite as unknown as jest.Mock).toHaveBeenCalledWith(path, {
      readonly: true,
      fileMustExist: true,
    });
  });
});
