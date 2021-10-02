import * as sqlite from 'better-sqlite3';
import { homedir } from 'os';
import { getCookie, Browser, listCookies, listProfiles } from '../src';
import { mockPlatform, restorePlatform } from './util';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(`[Profile1]
Name=default
IsRelative=1
Path=Profiles/mjr310e7.default
Default=1

[Profile0]
Name=default-release
IsRelative=1
Path=Profiles/tfhz7h6q.default-release`),
}));

jest.mock('better-sqlite3', () =>
  jest.fn().mockReturnValue({
    prepare: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'foo' }),
      all: jest.fn().mockReturnValue([
        {
          name: 'foo',
          value: 'foo',
          host: '.domain.com',
          path: '/',
        },
      ]),
    }),
  }),
);

describe('firefox list profiles', () => {
  it('should return  correct profiles', async () => {
    mockPlatform('linux');

    expect(await listProfiles(Browser.Firefox)).toEqual([
      'default',
      'default-release',
    ]);

    restorePlatform();
  });
});

describe('firefox get cookie', () => {
  describe('macos', () => {
    let originalPlatform: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
      });
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should fetch cookie correctly', async () => {
      expect(
        await getCookie({
          browser: Browser.Firefox,
          url: 'https://some.url',
          cookieName: 'some-cookie',
        }),
      ).toEqual('foo');
      expect(sqlite).toHaveBeenCalledWith(
        `${homedir()}/Library/Application Support/Firefox/Profiles/tfhz7h6q.default-release/cookies.sqlite`,
        { fileMustExist: true, readonly: true },
      );
    });

    it('should list cookies correctly', async () => {
      expect(
        await listCookies({
          browser: Browser.Firefox,
        }),
      ).toEqual([
        {
          name: 'foo',
          value: 'foo',
          host: '.domain.com',
          path: '/',
        },
      ]);
      expect(sqlite).toHaveBeenCalledWith(
        `${homedir()}/Library/Application Support/Firefox/Profiles/tfhz7h6q.default-release/cookies.sqlite`,
        { fileMustExist: true, readonly: true },
      );
    });
  });

  describe('linux', () => {
    let originalPlatform: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      });
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should fetch cookie correctly', async () => {
      expect(
        await getCookie({
          browser: Browser.Firefox,
          url: 'https://some.url',
          cookieName: 'some-cookie',
        }),
      ).toEqual('foo');
      expect(sqlite).toHaveBeenCalledWith(
        `${homedir()}/.mozilla/firefox/Profiles/tfhz7h6q.default-release/cookies.sqlite`,
        { fileMustExist: true, readonly: true },
      );
    });
  });

  describe('windows', () => {
    let originalPlatform: any;
    let originalAppData: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      originalAppData = process.env.APPDATA;
      process.env.APPDATA = 'C:/foo';
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
      process.env.APPDATA = originalAppData;
    });

    it('should fetch cookie correctly', async () => {
      expect(
        await getCookie({
          browser: Browser.Firefox,
          url: 'https://some.url',
          cookieName: 'some-cookie',
        }),
      ).toEqual('foo');
      expect(sqlite).toHaveBeenCalledWith(
        `C:/foo/Mozilla/Firefox/Profiles/tfhz7h6q.default-release/cookies.sqlite`,
        { fileMustExist: true, readonly: true },
      );
    });
  });

  describe('unsupported OS', () => {
    let originalPlatform: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'freebsd',
      });
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should throw an error', async () => {
      await expect(
        getCookie({
          browser: Browser.Firefox,
          url: 'https://someurl.com',
          cookieName: 'some-cookie',
        }),
      ).rejects.toThrow('Platform freebsd is not supported');
    });
  });
});
