type BooleanNumber = 0 | 1;

export type ChromeCookie = {
  host_key: string;
  path: string;
  is_secure: BooleanNumber;
  expires_utc: number;
  name: string;
  value: string;
  encrypted_value: Buffer;
  creation_utc: number;
  is_httponly: BooleanNumber;
  has_expires: BooleanNumber;
  is_persistent: BooleanNumber;
};

export interface ChromeCookieRepository {
  findCookie(cookieName: string, domain: string): ChromeCookie | undefined;
  listCookies(): ChromeCookie[];
}
