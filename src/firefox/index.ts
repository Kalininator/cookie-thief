import { join } from 'path';
import { mergeDefaults } from '../utils';
import { FirefoxCookieDatabase } from './FirefoxCookieDatabase';
import { Cookie } from '../types';
import { getProfiles, getUserDirectory } from './profiles';
import { FirefoxCookieProvider } from './FirefoxCookieProvider';

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

export async function listFirefoxProfiles(): Promise<string[]> {
  return getProfiles().map((p) => p.Name);
}

function getFirefoxCookieProvider(profile: string): FirefoxCookieProvider {
  const cookieFilePath = getCookieFilePath(profile);
  const db = new FirefoxCookieDatabase(cookieFilePath);
  return new FirefoxCookieProvider(db);
}

export async function getFirefoxCookie(
  domain: string,
  cookieName: string,
  options?: Partial<GetFirefoxCookieOptions>,
): Promise<Cookie | undefined> {
  const config = mergeDefaults(defaultOptions, options);
  const cookieRepo = getFirefoxCookieProvider(config.profile);
  return cookieRepo.getCookie(domain, cookieName);
}

export async function listFirefoxCookies(
  options?: Partial<GetFirefoxCookieOptions>,
): Promise<Cookie[]> {
  const config = mergeDefaults(defaultOptions, options);
  const cookieRepo = getFirefoxCookieProvider(config.profile);
  return cookieRepo.listCookies();
}
