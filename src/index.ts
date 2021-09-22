import { GetChromeCookiesOptions, getChromeCookie } from './chrome';
import { GetFirefoxCookieOptions, getFirefoxCookie } from './firefox';
import { assertUnreachable } from './utils';

export * from './chrome';
export * from './firefox';

export enum SupportedBrowser {
  Firefox = 'firefox',
  Chrome = 'chrome',
}

interface BaseGetCookieConfig {
  browser: SupportedBrowser;
  url: string;
  cookieName: string;
}

export interface GetFirefoxCookieConfig extends BaseGetCookieConfig {
  browser: SupportedBrowser.Firefox;
  options?: Partial<GetFirefoxCookieOptions>;
}

export interface GetChromeCookieConfig extends BaseGetCookieConfig {
  browser: SupportedBrowser.Chrome;
  options?: Partial<GetChromeCookiesOptions>;
}

export async function getCookie(
  config: GetFirefoxCookieConfig | GetChromeCookieConfig,
): Promise<string | undefined> {
  switch (config.browser) {
    case SupportedBrowser.Firefox:
      return getFirefoxCookie(config.url, config.cookieName, config.options);
    case SupportedBrowser.Chrome:
      return getChromeCookie(config.url, config.cookieName, config.options);
    default:
      return assertUnreachable(config);
  }
}
