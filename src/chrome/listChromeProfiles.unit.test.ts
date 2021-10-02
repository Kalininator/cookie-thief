import mockFs from 'mock-fs';
import { listChromeProfiles } from '.';

jest.mock('../../src/chrome/util', () => ({
  getPath: jest.fn().mockReturnValue('some/path'),
}));

describe('list chrome profiles', () => {
  it('should return Default', async () => {
    mockFs({
      'some/path': {
        'System Profile': {
          Preferences: '',
        },
        Default: {
          Preferences: '',
        },
      },
    });

    const profiles = await listChromeProfiles();

    expect(profiles).toEqual(['Default']);

    mockFs.restore();
  });
});
