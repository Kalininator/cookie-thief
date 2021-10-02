import { CookieProvider } from '../CookieProvider';
import { Cookie } from '../types';
import { ChromeCookie, ChromeCookieRepository } from './ChromeCookieRepository';
import { decrypt } from './decrypt';
import { getMacDerivedKey } from './getDerivedKey';

const KEYLENGTH = 16;
const ITERATIONS = 1003;

async function decryptCookie(cookie: ChromeCookie): Promise<string> {
  const derivedKey = await getMacDerivedKey(KEYLENGTH, ITERATIONS);
  return decrypt(derivedKey, cookie.encrypted_value, KEYLENGTH);
}

async function toCookie(chromeCookie: ChromeCookie): Promise<Cookie> {
  return {
    value: await decryptCookie(chromeCookie),
    host: chromeCookie.host_key,
    path: chromeCookie.path,
    name: chromeCookie.name,
  };
}

export class ChromeMacosCookieProvider implements CookieProvider {
  db: ChromeCookieRepository;

  constructor(db: ChromeCookieRepository) {
    this.db = db;
  }

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
