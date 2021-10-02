import {
  GetChromeCookiesOptions,
  getChromeCookie,
  listChromeCookies,
  listChromeProfiles,
} from './chrome';
import {
  GetFirefoxCookieOptions,
  getFirefoxCookie,
  listFirefoxCookies,
  listFirefoxProfiles
} from "./getUserDirectory";
import { Cookie } from './types';
import { assertUnreachable } from './utils';

export * from './chrome';
export * from './firefox';
export * from './types';

export enum Browser {
  Firefox = 'firefox',
  Chrome = 'chrome',
}

interface BaseGetCookieConfig {
  browser: Browser;
  domain: string;
  cookieName: string;
}

export interface GetFirefoxCookieConfig extends BaseGetCookieConfig {
  browser: Browser.Firefox;
  options?: Partial<GetFirefoxCookieOptions>;
}

export interface GetChromeCookieConfig extends BaseGetCookieConfig {
  browser: Browser.Chrome;
  options?: Partial<GetChromeCookiesOptions>;
}

export function listSupportedBrowsers(): Browser[] {
  return Object.values(Browser);
}

export async function getCookie(
  config: GetFirefoxCookieConfig | GetChromeCookieConfig,
): Promise<Cookie | undefined> {
  switch (config.browser) {
    case Browser.Firefox:
      return getFirefoxCookie(config.domain, config.cookieName, config.options);
    case Browser.Chrome:
      return getChromeCookie(config.domain, config.cookieName, config.options);
    default:
      return assertUnreachable(config);
  }
}

export interface ListFirefoxCookieConfig {
  browser: Browser.Firefox;
  options?: Partial<GetFirefoxCookieOptions>;
}

export interface ListChromeCookieConfig {
  browser: Browser.Chrome;
  options?: Partial<GetChromeCookiesOptions>;
}

export async function listCookies(
  config: ListFirefoxCookieConfig | ListChromeCookieConfig,
): Promise<Cookie[]> {
  switch (config.browser) {
    case Browser.Firefox:
      return listFirefoxCookies(config.options);
    case Browser.Chrome:
      return listChromeCookies(config.options);
    default:
      return assertUnreachable(config);
  }
}

export async function listProfiles(browser: Browser): Promise<string[]> {
  switch (browser) {
    case Browser.Firefox:
      return listFirefoxProfiles();
    case Browser.Chrome:
      return listChromeProfiles();
    default:
      return assertUnreachable(browser);
  }
}
