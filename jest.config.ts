/* cspell:ignore lcov */

import type { Config } from '@jest/types';

const configuration: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  logHeapUsage: true,
  preset: 'ts-jest',
  prettierPath: null,
  resetMocks: true,
  roots: ['<rootDir>/src', '<rootDir>/__mocks__'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  transformIgnorePatterns: ['node_modules/(?!semantic-release/.*)'],
};

export default configuration;
