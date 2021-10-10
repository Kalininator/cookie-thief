import { ChromeCookie, ChromeCookieRepository } from './ChromeCookieRepository';
import { ChromeWindowsCookieProvider } from './ChromeWindowsCookieProvider';

jest.mock('./decrypt', () => ({
  decryptWindows: jest.fn().mockResolvedValue('foo'),
}));

const fakeBuffer = Buffer.from('encrypted');

describe('chrome windows cookie provider', () => {
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

    const provider = new ChromeWindowsCookieProvider(mockDb);

    const cookie = await provider.getCookie('.test.com', 'some_cookie');

    expect(cookie).toEqual({
      value: 'foo',
      host: '.test.com',
      path: '/',
      name: 'some_cookie',
    });

    expect(mockFindCookie).toHaveBeenCalledWith('some_cookie', '.test.com');
  });
});
