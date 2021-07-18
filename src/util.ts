import { homedir } from 'os';
import tld from 'tldjs';

export function getDomain(url: string): string {
  const domain = tld.getDomain(url);
  if (domain) return domain;
  throw new Error(`Failed to extract domain from URL ${url}`);
}

export function getPath(): string {
  if (process.platform === 'darwin')
    return `${homedir()}/Library/Application Support/Google/Chrome/Default/Cookies`;
  if (process.platform === 'linux')
    return `${homedir()}/.config/google-chrome/Default/Cookies`;
  if (process.platform === 'win32')
    return `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\${'Default'}\\Cookies`;

  throw new Error(`Platform ${process.platform} is not supported`);
}

export function getIterations(): number {
  if (process.platform === 'darwin') return 1003;
  if (process.platform === 'linux') return 1;

  throw new Error(`Platform ${process.platform} is not supported`);
}
