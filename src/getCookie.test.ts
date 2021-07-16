import { getCookie } from '.';

describe('get cookie', () => {
  describe('windows', () => {
    let originalPlatform: any;

    beforeAll(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      Object.defineProperty(process, 'platform', {
        value: 'windows',
      });
    });

    afterAll(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    it('should throw error for windows', async () => {
      await expect(
        getCookie('https://someurl.com', 'somecookie'),
      ).rejects.toThrow('Platform windows is not supported');
    });
  });
});
