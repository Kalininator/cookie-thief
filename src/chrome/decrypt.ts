import crypto from 'crypto';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { getDpapi } from './optionalDependencies';

export function decrypt(
  key: crypto.CipherKey,
  encryptedData: Buffer,
  keyLength: number,
): string {
  const iv = Buffer.from(new Array(keyLength + 1).join(' '), 'binary');

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  decipher.setAutoPadding(false);

  const data = encryptedData.slice(3);
  let decoded = decipher.update(data);

  const final = decipher.final();
  final.copy(decoded, decoded.length ? decoded.length - 1 : 0);

  const padding = decoded[decoded.length - 1];
  if (padding) {
    decoded = decoded.slice(0, decoded.length - padding);
  }

  return decoded.toString('utf8');
}

export function decryptWindows(encryptedData: Buffer): string {
  const dpapi = getDpapi();

  if (
    encryptedData[0] === 0x01 &&
    encryptedData[1] === 0x00 &&
    encryptedData[2] === 0x00 &&
    encryptedData[3] === 0x00
  ) {
    return dpapi
      .unprotectData(encryptedData, null, 'CurrentUser')
      .toString('utf-8');
  }

  if (
    encryptedData[0] === 0x76 &&
    encryptedData[1] === 0x31 &&
    encryptedData[2] === 0x30
  ) {
    const localState = JSON.parse(
      readFileSync(
        `${homedir()}/AppData/Local/Google/Chrome/User Data/Local State`,
        'utf8',
      ),
    );
    const b64encodedKey = localState.os_crypt.encrypted_key;
    const encryptedKey = Buffer.from(b64encodedKey, 'base64');
    const key = dpapi.unprotectData(
      encryptedKey.slice(5, encryptedKey.length),
      null,
      'CurrentUser',
    );
    const nonce = encryptedData.slice(3, 15);
    const tag = encryptedData.slice(
      encryptedData.length - 16,
      encryptedData.length,
    );
    const encryptedValue = encryptedData.slice(15, encryptedData.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAuthTag(tag);
    let str = decipher.update(encryptedValue, undefined, 'utf8');
    str += decipher.final('utf-8');
    return str;
  }

  throw new Error('Failed to decrypt cookie');
}
