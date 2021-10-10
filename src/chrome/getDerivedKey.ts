import { promisify } from 'util';
import crypto from 'crypto';
import { getKeytar } from './optionalDependencies';

const promisedPbkdf2 = promisify(crypto.pbkdf2);

const SALT = 'saltysalt';

export async function getMacDerivedKey(
  keyLength: number,
  iterations: number,
): Promise<Buffer> {
  const keytar = getKeytar();
  const chromePassword = await keytar.getPassword(
    'Chrome Safe Storage',
    'Chrome',
  );
  if (!chromePassword) throw new Error('Could not fetch chrome password');
  const res = await promisedPbkdf2(
    chromePassword,
    SALT,
    iterations,
    keyLength,
    'sha1',
  );

  return res;
}

export async function getLinuxDerivedKey(
  keyLength: number,
  iterations: number,
): Promise<Buffer> {
  return promisedPbkdf2('peanuts', SALT, iterations, keyLength, 'sha1');
}

export async function getDerivedKey(
  keyLength: number,
  iterations: number,
): Promise<Buffer> {
  if (process.platform === 'darwin')
    return getMacDerivedKey(keyLength, iterations);

  if (process.platform === 'linux')
    return getLinuxDerivedKey(keyLength, iterations);

  throw new Error(`Platform ${process.platform} is not supported`);
}
