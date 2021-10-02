import { homedir } from 'os';

export function getPath(): string {
  if (process.platform === 'darwin')
    return `${homedir()}/Library/Application Support/Google/Chrome`;
  if (process.platform === 'linux') return `${homedir()}/.config/google-chrome`;
  if (process.platform === 'win32')
    return `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data`;

  throw new Error(`Platform ${process.platform} is not supported`);
}

export function getCookiesPath(profile: string): string {
  if (process.platform === 'darwin')
    return `${homedir()}/Library/Application Support/Google/Chrome/${profile}/Cookies`;
  if (process.platform === 'linux')
    return `${homedir()}/.config/google-chrome/${profile}/Cookies`;
  if (process.platform === 'win32')
    return `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\${profile}\\Cookies`;

  throw new Error(`Platform ${process.platform} is not supported`);
}
