import { homedir } from 'os';
import { getCookiesPath, getPath } from './util';
import { mockPlatform, restorePlatform } from '../../test/util';

describe('getPath', () => {
  afterEach(() => {
    restorePlatform();
  });

  it('should get correct windows path', async () => {
    mockPlatform('win32');

    expect(getPath()).toEqual(
      `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data`,
    );
  });

  it('should get correct macos path', async () => {
    mockPlatform('darwin');

    expect(getPath()).toEqual(
      `${homedir()}/Library/Application Support/Google/Chrome`,
    );
  });

  it('should get correct linux path', async () => {
    mockPlatform('linux');

    expect(getPath()).toEqual(`${homedir()}/.config/google-chrome`);
  });

  it('should throw if invalid os', () => {
    mockPlatform('freebsd');

    expect(() => getPath()).toThrow('Platform freebsd is not supported');
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
