import { mockPlatform, restorePlatform } from '../../test/util';
import { getDerivedKey } from './getDerivedKey';
import { getKeytar } from './optionalDependencies';

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

    expect(derivedKey).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          170,
          160,
          234,
          115,
          251,
          29,
          54,
          167,
          206,
          247,
          241,
          60,
          16,
          31,
          94,
          231,
        ],
        "type": "Buffer",
      }
    `);

    restorePlatform();
  });
});
