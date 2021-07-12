import crypto from 'crypto';

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
  final.copy(decoded, decoded.length - 1);

  const padding = decoded[decoded.length - 1];
  if (padding) {
    decoded = decoded.slice(0, decoded.length - padding);
  }

  return decoded.toString('utf8');
}
