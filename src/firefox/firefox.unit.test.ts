import * as sqlite from 'better-sqlite3';
import { homedir } from 'os';
import { getFirefoxCookie } from '..';

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(`[Profile1]
Name=default
IsRelative=1
Path=Profiles/mjr310e7.default
Default=1

[Profile0]
Name=default-release
IsRelative=1
Path=Profiles/tfhz7h6q.default-release`),
}));

jest.mock('better-sqlite3', () =>
  jest.fn().mockReturnValue({
    prepare: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'foo' }),
    }),
  }),
);

describe('firefox get cookie', () => {
  describe('linux', () => {
    let originalPlatform: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
      });
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should fetch cookie correctly', async () => {
      expect(await getFirefoxCookie('https://some.url', 'some-cookie')).toEqual(
        'foo',
      );
      expect(sqlite).toHaveBeenCalledWith(
        `${homedir()}/Library/Application Support/Firefox/Profiles/tfhz7h6q.default-release/cookies.sqlite`,
        { fileMustExist: true, readonly: true },
      );
    });
  });
});
