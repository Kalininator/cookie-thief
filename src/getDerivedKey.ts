import keytar from 'keytar';
import { promisify } from 'util';
import crypto from 'crypto';

export async function getDerivedKey(
  keyLength: number,
  iterations: number,
): Promise<Buffer> {
  const chromePassword = await keytar.getPassword(
    'Chrome Safe Storage',
    'Chrome',
  );
  if (!chromePassword) throw new Error('Could not fetch chrome password');
  const promisedPbkdf2 = promisify(crypto.pbkdf2);
  const res = await promisedPbkdf2(
    chromePassword,
    'saltysalt',
    iterations,
    keyLength,
    'sha1',
  );

  return res;
}
