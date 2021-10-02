import { Cookie } from './types';

export interface CookieProvider {
  getCookie(domain: string, cookieName: string): Promise<Cookie | undefined>;
  listCookies(): Promise<Cookie[]>;
}
