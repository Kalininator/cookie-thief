import { homedir } from 'os';
import { getDomain, getIterations, getPath } from './util';

describe('getDomain', () => {
  it('should extract domain from github.com', () => {
    expect(getDomain('https://github.com')).toEqual('github.com');
  });

  it('should extract domain from https://some.web.site.com/some/page', () => {
    expect(getDomain('https://some.web.site.com/some/page')).toEqual(
      'site.com',
    );
  });
});

describe('getPath', () => {
  describe('default profile', () => {
    it('should get correct windows path', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(
        process,
        'platform',
      );
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });

      expect(getPath('Default')).toEqual(
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

      expect(getPath('Default')).toEqual(
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

      expect(getPath('Default')).toEqual(
        `${homedir()}/.config/google-chrome/Default/Cookies`,
      );

      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should throw if invalid os', () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(
        process,
        'platform',
      );
      Object.defineProperty(process, 'platform', {
        value: 'freebsd',
      });

      expect(() => getPath('Default')).toThrow(
        'Platform freebsd is not supported',
      );

      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });
  });

  describe('custom profile', () => {
    it('should get correct windows path', async () => {
      const originalPlatform = Object.getOwnPropertyDescriptor(
        process,
        'platform',
      );
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });

      expect(getPath('Custom')).toEqual(
        `${homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Custom\\Cookies`,
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

      expect(getPath('Custom')).toEqual(
        `${homedir()}/Library/Application Support/Google/Chrome/Custom/Cookies`,
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

      expect(getPath('Custom')).toEqual(
        `${homedir()}/.config/google-chrome/Custom/Cookies`,
      );

      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });
  });
});

describe('getIterations', () => {
  it('should get correct macos iterations', async () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    });

    expect(getIterations()).toEqual(1003);

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should get correct linux iterations', async () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });

    expect(getIterations()).toEqual(1);

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should throw if invalid os', () => {
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      'platform',
    );
    Object.defineProperty(process, 'platform', {
      value: 'windows',
    });

    expect(() => getIterations()).toThrow('Platform windows is not supported');

    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });
});
