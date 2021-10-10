import { CookieProvider } from '../CookieProvider';
import { Cookie } from '../types';
import { ChromeCookie, ChromeCookieRepository } from './ChromeCookieRepository';
import { decryptWindows } from './decrypt';

async function decryptCookie(cookie: ChromeCookie): Promise<string> {
  return decryptWindows(cookie.encrypted_value);
}

async function toCookie(chromeCookie: ChromeCookie): Promise<Cookie> {
  return {
    value: await decryptCookie(chromeCookie),
    host: chromeCookie.host_key,
    path: chromeCookie.path,
    name: chromeCookie.name,
  };
}

export class ChromeWindowsCookieProvider implements CookieProvider {
  constructor(private db: ChromeCookieRepository) {}

  async getCookie(
    domain: string,
    cookieName: string,
  ): Promise<Cookie | undefined> {
    const chromeCookie = this.db.findCookie(cookieName, domain);
    if (!chromeCookie) return undefined;
    return toCookie(chromeCookie);
  }

  async listCookies(): Promise<Cookie[]> {
    return Promise.all(this.db.listCookies().map(toCookie));
  }
}
