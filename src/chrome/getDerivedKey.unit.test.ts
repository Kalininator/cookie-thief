import { mockPlatform, restorePlatform } from '../../test/util';
import { getDerivedKey } from './getDerivedKey';

describe('get derived key', () => {
  it('should throw err for unsupported platform', async () => {
    mockPlatform('win32');

    await expect(getDerivedKey(16, 1)).rejects.toThrow(
      'Platform win32 is not supported',
    );
    restorePlatform();
  });
});
