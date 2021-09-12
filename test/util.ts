const originalPlatform = process.platform;
export function mockPlatform(platform: NodeJS.Platform) {
  Object.defineProperty(process, 'platform', {
    value: platform,
  });
}

export function restorePlatform() {
  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
  });
}
