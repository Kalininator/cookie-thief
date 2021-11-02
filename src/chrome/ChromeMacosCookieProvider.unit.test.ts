import { ChromeCookie, ChromeCookieRepository } from './ChromeCookieRepository';
import { ChromeMacosCookieProvider } from './ChromeMacosCookieProvider';

jest.mock('./decrypt', () => ({
  decrypt: jest.fn().mockResolvedValue('foo'),
}));

jest.mock('./getDerivedKey', () => ({
  getMacDerivedKey: jest.fn().mockResolvedValue(Buffer.from('some_key')),
}));

const fakeBuffer = Buffer.from('encrypted');

describe('chrome macos cookie provider', () => {
  it('should fetch and decrypt cookie', async () => {
    const mockFindCookie = jest
      .fn()
      .mockImplementation(
        (cookieName: string, domain: string): ChromeCookie => {
          return {
            host_key: domain,
            path: '/',
            name: cookieName,
            encrypted_value: fakeBuffer,
          };
        },
      );
    const mockDb: ChromeCookieRepository = {
      findCookie: mockFindCookie,
      listCookies(): ChromeCookie[] {
        throw new Error('Function not implemented.');
      },
    };

    const provider = new ChromeMacosCookieProvider(mockDb);

    const cookie = await provider.getCookie('.test.com', 'some_cookie');

    expect(cookie).toEqual({
      value: 'foo',
      host: '.test.com',
      path: '/',
      name: 'some_cookie',
    });

    expect(mockFindCookie).toHaveBeenCalledWith('some_cookie', '.test.com');
  });

  it('should return undefined if cookie not found', async () => {
    const mockFindCookie = jest.fn().mockReturnValue(undefined);
    const mockDb: ChromeCookieRepository = {
      findCookie: mockFindCookie,
      listCookies(): ChromeCookie[] {
        throw new Error('Function not implemented.');
      },
    };

    const provider = new ChromeMacosCookieProvider(mockDb);

    const cookie = await provider.getCookie('.test.com', 'some_cookie');

    expect(cookie).toEqual(undefined);

    expect(mockFindCookie).toHaveBeenCalledWith('some_cookie', '.test.com');
  });

  it('should list and decrypt cookies', async () => {
    const mockListCookies = jest.fn().mockImplementation((): ChromeCookie[] => {
      return [
        {
          host_key: '.some.url',
          path: '/',
          name: 'someCookie',
          encrypted_value: fakeBuffer,
        },
      ];
    });
    const mockDb: ChromeCookieRepository = {
      findCookie() {
        throw new Error('function not implemented');
      },
      listCookies: mockListCookies,
    };

    const provider = new ChromeMacosCookieProvider(mockDb);

    const cookies = await provider.listCookies();

    expect(cookies).toEqual([
      {
        value: 'foo',
        host: '.some.url',
        path: '/',
        name: 'someCookie',
      },
    ]);

    expect(mockListCookies).toHaveBeenCalledWith();
  });
});
