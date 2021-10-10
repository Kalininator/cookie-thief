import * as sqlite from 'better-sqlite3';
import { ChromeCookieDatabase } from './ChromeCookieDatabase';

jest.mock('better-sqlite3');

describe('ChromeCookieDatabase', () => {
  it('get single cookie', () => {
    const getFn = jest.fn().mockReturnValue({
      host_key: '.domain.com',
      path: '/',
      name: 'someCookie',
      encrypted_value: 'encrypted_foo',
    });
    const prepareFn = jest.fn().mockReturnValue({ get: getFn });
    (sqlite as unknown as jest.Mock).mockReturnValue({
      prepare: prepareFn,
    });

    const path = '/some/path/db.sqlite';

    const db = new ChromeCookieDatabase(path);

    const cookie = db.findCookie('someCookie', '.domain.com');

    expect(cookie).toEqual({
      encrypted_value: 'encrypted_foo',
      host_key: '.domain.com',
      name: 'someCookie',
      path: '/',
    });
    expect(getFn).toHaveBeenCalled();
    expect(prepareFn).toHaveBeenCalledWith(
      `SELECT host_key, path, name, encrypted_value FROM cookies where host_key like '%.domain.com' and name like '%someCookie' ORDER BY LENGTH(path) DESC, creation_utc ASC`,
    );
    expect(sqlite as unknown as jest.Mock).toHaveBeenCalledWith(path, {
      readonly: true,
      fileMustExist: true,
    });
  });

  it('get all cookies', () => {
    const allFn = jest.fn().mockReturnValue([
      {
        host_key: '.domain.com',
        path: '/',
        name: 'someCookie',
        encrypted_value: 'encrypted_foo',
      },
    ]);
    const prepareFn = jest.fn().mockReturnValue({ all: allFn });
    (sqlite as unknown as jest.Mock).mockReturnValue({
      prepare: prepareFn,
    });

    const path = '/some/path/db.sqlite';

    const db = new ChromeCookieDatabase(path);

    const cookie = db.listCookies();

    expect(cookie).toEqual([
      {
        encrypted_value: 'encrypted_foo',
        host_key: '.domain.com',
        name: 'someCookie',
        path: '/',
      },
    ]);
    expect(allFn).toHaveBeenCalled();
    expect(prepareFn).toHaveBeenCalledWith(
      `SELECT host_key, path, name, encrypted_value FROM cookies`,
    );
    expect(sqlite as unknown as jest.Mock).toHaveBeenCalledWith(path, {
      readonly: true,
      fileMustExist: true,
    });
  });
});
