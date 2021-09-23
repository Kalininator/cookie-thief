import { GetChromeCookiesOptions, getChromeCookie } from './chrome';
import { GetFirefoxCookieOptions, getFirefoxCookie } from './firefox';
import { assertUnreachable } from './utils';

export * from './chrome';
export * from './firefox';

export enum Browser {
  Firefox = 'firefox',
  Chrome = 'chrome',
}

interface BaseGetCookieConfig {
  browser: Browser;
  url: string;
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
): Promise<string | undefined> {
  switch (config.browser) {
    case Browser.Firefox:
      return getFirefoxCookie(config.url, config.cookieName, config.options);
    case Browser.Chrome:
      return getChromeCookie(config.url, config.cookieName, config.options);
    default:
      return assertUnreachable(config);
  }
}
