import { readFileSync } from 'fs';
import * as ini from 'ini';
import { homedir } from 'os';
import { join } from 'path';

export function getUserDirectory(): string {
  switch (process.platform) {
    case 'darwin':
      return join(homedir(), '/Library/Application Support/Firefox');
    case 'linux':
      return join(homedir(), '/.mozilla/firefox');
    case 'win32':
      return join(process.env.APPDATA!, '/Mozilla/Firefox');
    default:
      throw new Error(`Platform ${process.platform} is not supported`);
  }
}
export type FirefoxProfile = {
  Name: string;
  IsRelative: number;
  Path: string;
  Default?: number;
};

export function getProfiles(): FirefoxProfile[] {
  const userDirectory = getUserDirectory();
  const fileData = readFileSync(join(userDirectory, 'profiles.ini'), {
    encoding: 'utf8',
  });

  const iniData = ini.parse(fileData);
  return Object.keys(iniData)
    .filter((key) => {
      return typeof key === 'string' && key.match(/^Profile/);
    })
    .map((key) => iniData[key]);
}
