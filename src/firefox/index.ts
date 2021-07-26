import sqlite from 'better-sqlite3';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as ini from 'ini';
import { getDomain } from 'tldjs';
import { mergeDefaults } from '../utils';

function getUserDirectory(): string {
  switch (process.platform) {
    case 'darwin':
      return join(homedir(), '/Library/Application Support/Firefox');
    case 'linux':
      return join(homedir(), '/.mozilla/fiefox');
    case 'win32':
      return join(process.env.APPDATA!, '/Mozilla/Firefox');
    default:
      throw new Error(`Platform ${process.platform} is not supported`);
  }
}

type FirefoxProfile = {
  Name: string;
  IsRelative: number;
  Path: string;
  Default?: number;
};

function getProfiles(): FirefoxProfile[] {
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

function getCookieFilePath(profile: string): string {
  const profiles = getProfiles();
  const defaultProfile = profiles.find((p) => p.Name === profile);
  if (!defaultProfile) throw new Error(`${profile} profile not found`);
  return join(getUserDirectory(), defaultProfile.Path, 'cookies.sqlite');
}

export interface GetFirefoxCookieOptions {
  profile: string;
}

const defaultOptions: GetFirefoxCookieOptions = {
  profile: 'default-release',
};

export async function getFirefoxCookie(
  url: string,
  cookieName: string,
  options?: Partial<GetFirefoxCookieOptions>,
): Promise<string> {
  const config = mergeDefaults(defaultOptions, options);
  const domain = getDomain(url);
  const cookieFilePath = getCookieFilePath(config.profile);
  const db = sqlite(cookieFilePath, { readonly: true, fileMustExist: true });
  const statement = db.prepare(
    `SELECT value from moz_cookies WHERE name like '${cookieName}' AND host like '%${domain}'`,
  );
  const res = statement.get();
  return res?.value;
}
