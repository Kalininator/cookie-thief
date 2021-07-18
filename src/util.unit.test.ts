import { homedir } from 'os';
import { getDomain, getPath } from './util';

describe('getDomain', () => {
  it('should extract domain', () => {
    expect(getDomain('https://github.com')).toEqual('github.com');
  });
});

describe('getPath', () => {
  it('should get correct windows path', async () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });

    expect(getPath()).toEqual(
      `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cookies`,
    );

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should get correct macos path', async () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    });

    expect(getPath()).toEqual(
      `${homedir()}/Library/Application Support/Google/Chrome/Default/Cookies`,
    );

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should get correct linux path', async () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });

    expect(getPath()).toEqual(
      `${homedir()}/.config/google-chrome/Default/Cookies`,
    );

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });
});
