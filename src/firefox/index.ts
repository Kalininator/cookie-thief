import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as ini from 'ini';
import { getDomain } from 'tldjs';
import { mergeDefaults } from '../utils';
import { FirefoxCookieDatabase } from './FirefoxCookieDatabase';
import { Cookie } from '../types';

function getUserDirectory(): string {
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

/**
 * @deprecated Replaced by getCookie
 */

export async function getFirefoxCookie(
  url: string,
  cookieName: string,
  options?: Partial<GetFirefoxCookieOptions>,
): Promise<string | undefined> {
  const config = mergeDefaults(defaultOptions, options);
  const domain = getDomain(url);
  if (!domain) throw new Error('Could not extract domain from URL');
  const cookieFilePath = getCookieFilePath(config.profile);
  const db = new FirefoxCookieDatabase(cookieFilePath);
  return db.findCookie(cookieName, domain);
}

export async function listFirefoxCookies(
  options?: Partial<GetFirefoxCookieOptions>,
): Promise<Cookie[]> {
  const config = mergeDefaults(defaultOptions, options);
  const cookieFilePath = getCookieFilePath(config.profile);
  const db = new FirefoxCookieDatabase(cookieFilePath);
  return db.listCookies();
}
