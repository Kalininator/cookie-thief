import { getChromeCookie } from '../../src';

jest.mock('better-sqlite3', () =>
  jest.fn().mockReturnValue({
    prepare: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({
        encrypted_value: Buffer.from('1MNujnd6tlf09xoB4tvBLQ==', 'base64'),
      }),
    }),
  }),
);

jest.mock('../../src/chrome/decrypt', () => ({
  decrypt: jest.fn().mockReturnValue('bar'),
}));

describe('chrome - linux', () => {
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

  it('gets and decrypts linux cookie', async () => {
    const res = await getChromeCookie('https://someUrl.com', 'foo');

    expect(res).toEqual('bar');
  });
});
