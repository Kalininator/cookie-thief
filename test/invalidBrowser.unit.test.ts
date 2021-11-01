import { listProfiles, listCookies, getCookie } from '../src';

describe('list profiles', () => {
  it('should throw if invalid browser', async () => {
    await expect(
      listProfiles('foo' as any),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Invalid value 'foo'"`);
  });
});

describe('list cookies', () => {
  it('should throw if invalid browser', async () => {
    await expect(
      listCookies({ browser: 'foo' as any }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invalid value { browser: 'foo' }"`,
    );
  });
});

describe('get cookie', () => {
  it('should throw if invalid browser', async () => {
    await expect(
      getCookie({
        domain: '.foo.com',
        cookieName: 'cookie',
        browser: 'foo' as any,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invalid value { domain: '.foo.com', cookieName: 'cookie', browser: 'foo' }"`,
    );
  });
});
