import { mockPlatform, restorePlatform } from '../../test/util';
import { getDerivedKey, getMacDerivedKey } from './getDerivedKey';
import { getKeytar } from './optionalDependencies';

/* MacOS pbkdf2
 * message: foo (retrieved from keytar)
 * salt: saltysalt
 * iterations: 1001
 * length: 16
 * hash hex: AAA0EA73FB1D36A7CEF7F13C101F5EE7
 */

/* Linux pbkdf2
 * message: peanuts
 * salt: saltysalt
 * iterations: 1
 * length: 16
 * hash hex: FD621FE5A2B402539DFA147CA9272778
 */

jest.mock('./optionalDependencies', () => ({
  getKeytar: jest.fn(),
}));

describe('get derived key', () => {
  it('should throw err for unsupported platform', async () => {
    mockPlatform('win32');

    await expect(getDerivedKey(16, 1)).rejects.toThrow(
      'Platform win32 is not supported',
    );
    restorePlatform();
  });

  it('shoud throw if failed to get chrome password', async () => {
    (getKeytar as jest.Mock).mockReturnValue({
      getPassword: jest.fn().mockResolvedValue(undefined),
    });

    expect(
      getMacDerivedKey(15, 1001),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Could not fetch chrome password"`,
    );
  });

  it('should return mac derived key', async () => {
    const getPasswordFunction = jest.fn().mockReturnValue('foo');
    (getKeytar as jest.Mock).mockReturnValue({
      getPassword: getPasswordFunction,
    });

    mockPlatform('darwin');

    const derivedKey = await getDerivedKey(16, 1001);

    expect(getPasswordFunction).toHaveBeenCalledWith(
      'Chrome Safe Storage',
      'Chrome',
    );

    expect(getKeytar).toHaveBeenCalled();

    expect(derivedKey).toEqual(
      Buffer.from('AAA0EA73FB1D36A7CEF7F13C101F5EE7', 'hex'),
    );

    restorePlatform();
  });

  it('should return correct linux derived key', async () => {
    mockPlatform('linux');

    const derivedKey = await getDerivedKey(16, 1);

    expect(derivedKey).toEqual(
      Buffer.from('FD621FE5A2B402539DFA147CA9272778', 'hex'),
    );

    restorePlatform();
  });
});
