// eslint-disable-next-line immutable/no-mutation
module.exports = {
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
  preset: 'ts-jest',
  resetMocks: true,
  roots: ['<rootDir>/src', '<rootDir>/__mocks__'],
  testEnvironment: 'node',
};
