import { homedir } from 'os';

export function getDomain(url: string): string {
  const { hostname } = new URL(url);
  return hostname;
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
