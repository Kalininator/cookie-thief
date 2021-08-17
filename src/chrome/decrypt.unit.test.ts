import { createCipheriv } from 'crypto';
import { decrypt } from './decrypt';
import { getLinuxDerivedKey } from './getDerivedKey';

describe('chrome decrypt - linux', () => {
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
