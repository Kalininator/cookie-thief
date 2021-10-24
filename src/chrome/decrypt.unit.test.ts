import { createCipheriv } from 'crypto';
import { decrypt, decryptWindows } from './decrypt';
import { getLinuxDerivedKey } from './getDerivedKey';
import { getDpapi } from './optionalDependencies';
import { mockPlatform, restorePlatform } from '../../test/util';

describe('chrome decrypt - linux', () => {
  beforeAll(() => {
    mockPlatform('linux');
  });

  afterAll(() => {
    restorePlatform();
  });

  it('gets and decrypts linux cookie', async () => {
    const dk = await getLinuxDerivedKey(16, 1);
    const iv = Buffer.from(new Array(16 + 1).join(' '), 'binary');
    const cipher = createCipheriv('aes-128-cbc', dk, iv);
    cipher.update('bar');
    const final = cipher.final();
    const v10 = Buffer.from('v10');
    const concatted = Buffer.concat([v10, final]);

    const res = decrypt(dk, concatted, 16);

    expect(res).toEqual('bar');
  });
});

jest.mock('./optionalDependencies', () => ({
  getDpapi: jest.fn(),
}));

describe('chrome decrypt - window', () => {
  beforeAll(() => {
    mockPlatform('win32');
  });

  afterAll(() => {
    restorePlatform();
  });

  it('should decrypt current user cookie', async () => {
    const unprotectDataFn = jest.fn().mockReturnValue(Buffer.from('foo'));

    (getDpapi as jest.Mock).mockReturnValue({
      unprotectData: unprotectDataFn,
    });

    const bufferPrefix = Buffer.from([0x01, 0x00, 0x00, 0x00]);

    const bufContents = Buffer.from('bar');

    const fullBuf = Buffer.concat([bufferPrefix, bufContents]);

    const decrypted = decryptWindows(fullBuf);

    expect(unprotectDataFn).toHaveBeenCalledWith(fullBuf, null, 'CurrentUser');

    expect(decrypted).toEqual('foo');
  });
});
