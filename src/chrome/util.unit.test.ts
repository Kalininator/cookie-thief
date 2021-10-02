import { homedir } from 'os';
import { getDomain, getIterations, getCookiesPath } from './util';
import { mockPlatform, restorePlatform } from '../../test/util';

describe('getDomain', () => {
  it('should extract domain from github.com', () => {
    expect(getDomain('https://github.com')).toEqual('github.com');
  });

  it('should extract domain from https://some.web.site.com/some/page', () => {
    expect(getDomain('https://some.web.site.com/some/page')).toEqual(
      'site.com',
    );
  });

  it('should fail to extract domain', () => {
    expect(() => getDomain('foo')).toThrowError(
      'Failed to extract domain from URL foo',
    );
  });
});

describe('getCookiesPath', () => {
  afterEach(() => {
    restorePlatform();
  });

  it('should get correct windows path', async () => {
    mockPlatform('win32');

    expect(getCookiesPath('Default')).toEqual(
      `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cookies`,
    );
  });

  it('should get correct macos path', async () => {
    mockPlatform('darwin');

    expect(getCookiesPath('Default')).toEqual(
      `${homedir()}/Library/Application Support/Google/Chrome/Default/Cookies`,
    );
  });

  it('should get correct linux path', async () => {
    mockPlatform('linux');

    expect(getCookiesPath('Default')).toEqual(
      `${homedir()}/.config/google-chrome/Default/Cookies`,
    );
  });

  it('should throw if invalid os', () => {
    mockPlatform('freebsd');

    expect(() => getCookiesPath('Default')).toThrow(
      'Platform freebsd is not supported',
    );
  });
});

describe('getIterations', () => {
  afterEach(restorePlatform);

  it('should get correct macos iterations', async () => {
    mockPlatform('darwin');

    expect(getIterations()).toEqual(1003);
  });

  it('should get correct linux iterations', async () => {
    mockPlatform('linux');

    expect(getIterations()).toEqual(1);
  });

  it('should throw if invalid os', () => {
    mockPlatform('win32');

    expect(() => getIterations()).toThrow('Platform win32 is not supported');
  });
});
