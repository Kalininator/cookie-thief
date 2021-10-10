import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { CookieProvider } from '../CookieProvider';
import { Cookie } from '../types';
import { mergeDefaults } from '../utils';
import { ChromeCookieDatabase } from './ChromeCookieDatabase';
import { ChromeLinuxCookieProvider } from './ChromeLinuxCookieProvider';
import { ChromeMacosCookieProvider } from './ChromeMacosCookieProvider';
import { ChromeWindowsCookieProvider } from './ChromeWindowsCookieProvider';

import { getCookiesPath, getPath } from './util';

export interface GetChromeCookiesOptions {
  profile: string;
}

const defaultOptions: GetChromeCookiesOptions = {
  profile: 'Default',
};

function getChromeCookieProvider(profile: string): CookieProvider {
  const path = getCookiesPath(profile);
  const db = new ChromeCookieDatabase(path);
  if (process.platform === 'darwin') return new ChromeMacosCookieProvider(db);
  if (process.platform === 'linux') return new ChromeLinuxCookieProvider(db);
  if (process.platform === 'win32') return new ChromeWindowsCookieProvider(db);

  throw new Error(`Platform ${process.platform} is not supported`);
}

export async function getChromeCookie(
  domain: string,
  cookieName: string,
  options?: Partial<GetChromeCookiesOptions>,
): Promise<Cookie | undefined> {
  const config = mergeDefaults(defaultOptions, options);
  const provider = getChromeCookieProvider(config.profile);
  return provider.getCookie(domain, cookieName);
}

export async function listChromeProfiles(): Promise<string[]> {
  const path = getPath();
  return readdirSync(path).filter(
    (f) => f !== 'System Profile' && existsSync(join(path, f, 'Preferences')),
  );
}

export async function listChromeCookies(
  options?: Partial<GetChromeCookiesOptions>,
): Promise<Cookie[]> {
  const config = mergeDefaults(defaultOptions, options);
  const provider = getChromeCookieProvider(config.profile);
  return provider.listCookies();
}
