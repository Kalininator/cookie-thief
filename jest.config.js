const path = require('path');

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  reporters: ['default'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/tests/'],
  verbose: true,
  transform: { '\\.ts$': ['ts-jest'] },
};
