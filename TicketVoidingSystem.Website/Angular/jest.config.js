const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: [
    '<rootDir>/src/home-page/**/*.spec.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/manage-void-services/',
    // '<rootDir>/src/utility/',
  ],
  setupFilesAfterEnv : ['<rootDir>/test-setup.ts'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  //collectCoverageFrom: ['src/ab-white-list/**/*.ts'],
  coveragePathIgnorePatterns: ['.spec.ts', '.module.ts', 'src/polyfills.ts', 'main.ts', 'model.ts', 'query.ts'],
  coverageReporters: ['html', ['lcovonly', { 'projectRoot': '../../' }]],
  coverageDirectory: 'reports/coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  })
};