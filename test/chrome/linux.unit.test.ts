import { getChromeCookie } from '../../src';
import { mockPlatform, restorePlatform } from '../util';

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
  beforeAll(() => {
    mockPlatform('linux');
  });

  afterAll(() => {
    restorePlatform();
  });

  it('gets and decrypts linux cookie', async () => {
    const res = await getChromeCookie('https://someUrl.com', 'foo');

    expect(res).toEqual('bar');
  });
});