export type ChromeCookie = {
  host_key: string;
  path: string;
  name: string;
  encrypted_value: Buffer;
};

export interface ChromeCookieRepository {
  findCookie(cookieName: string, domain: string): ChromeCookie | undefined;
  listCookies(): ChromeCookie[];
}
