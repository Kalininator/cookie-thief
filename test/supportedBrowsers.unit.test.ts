import { listSupportedBrowsers } from '../src';

describe('list supported browsers', () => {
  const browsers = listSupportedBrowsers();
  it('should contain firefox', () => {
    expect(browsers).toContain('firefox');
  });
  it('should contain chrome', () => {
    expect(browsers).toContain('chrome');
  });
});
