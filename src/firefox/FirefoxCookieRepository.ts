export type MozCookie = {
  name: string;
  value: string;
  host: string;
  path: string;
};

export interface FirefoxCookieRepository {
  findCookie(cookieName: string, domain: string): MozCookie | undefined;
  listCookies(): MozCookie[];
}
