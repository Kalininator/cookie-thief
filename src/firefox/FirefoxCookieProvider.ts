import { CookieProvider } from '../CookieProvider';
import { Cookie } from '../types';
import { FirefoxCookieRepository } from './FirefoxCookieRepository';

export class FirefoxCookieProvider implements CookieProvider {
  constructor(private db: FirefoxCookieRepository) {}

  async getCookie(
    domain: string,
    cookieName: string,
  ): Promise<Cookie | undefined> {
    return this.db.findCookie(cookieName, domain);
  }

  async listCookies(): Promise<Cookie[]> {
    return this.db.listCookies();
  }
}
