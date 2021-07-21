import sqlite from 'better-sqlite3';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import * as ini from 'ini';
import _ from 'lodash';
import { getDomain } from 'tldjs';

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
  return _.filter(ini.parse(fileData), (_value, key) => {
    return _.isString(key) && key.match(/^Profile/);
  });
}

function getCookieFilePath(): string {
  const profiles = getProfiles();
  const defaultProfile = profiles.find(
    (profile) => profile.Name === 'default-release',
  );
  if (!defaultProfile) throw new Error('Default profile not found');
  return join(getUserDirectory(), defaultProfile.Path, 'cookies.sqlite');
}

export async function getFirefoxCookies(
  url: string,
  cookieName: string,
): Promise<string> {
  const domain = getDomain(url);
  const cookieFilePath = getCookieFilePath();
  const db = sqlite(cookieFilePath, { readonly: true, fileMustExist: true });
  const statement = db.prepare(
    `SELECT value from moz_cookies WHERE name like '${cookieName}' AND host like '%${domain}'`,
  );
  const res = statement.get();
  console.log(res);
  return res.value;
}
