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
  extensionsToTreatAsEsm: ['.ts'],
  injectGlobals: true,
  logHeapUsage: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  resetMocks: true,
  roots: ['<rootDir>/src', '<rootDir>/__mocks__'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/src/index.spec.ts'],
};

export default configuration;
