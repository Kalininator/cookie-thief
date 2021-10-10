import { Browser, getCookie, listCookies } from '../../src';
import { mockPlatform, restorePlatform } from '../util';

jest.mock('better-sqlite3', () =>
  jest.fn().mockReturnValue({
    prepare: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({
        encrypted_value: Buffer.from('1MNujnd6tlf09xoB4tvBLQ==', 'base64'),
        name: 'foo',
        path: '/',
        host_key: '.someUrl.com',
      }),
      all: jest.fn().mockReturnValue([
        {
          name: 'foo',
          path: '/',
          host_key: '.domain.com',
          encrypted_value: Buffer.from('1MNujnd6tlf09xoB4tvBLQ==', 'base64'),
        },
      ]),
    }),
  }),
);

jest.mock('../../src/chrome/decrypt', () => ({
  decrypt: jest.fn().mockReturnValue('bar'),
}));

describe('chrome - linux', () => {
  beforeAll(() => {
    mockPlatform('linux');
  });

  afterAll(() => {
    restorePlatform();
  });

  it('gets and decrypts linux cookie', async () => {
    const res = await getCookie({
      browser: Browser.Chrome,
      domain: '.someUrl.com',
      cookieName: 'foo',
    });

    expect(res).toEqual({
      value: 'bar',
      host: '.someUrl.com',
      path: '/',
      name: 'foo',
    });
  });

  it('lists and decrypts linux cookies', async () => {
    const res = await listCookies({
      browser: Browser.Chrome,
    });

    expect(res).toEqual([
      {
        name: 'foo',
        path: '/',
        host: '.domain.com',
        value: 'bar',
      },
    ]);
  });
});
