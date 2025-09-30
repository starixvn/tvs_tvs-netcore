const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    //'<rootDir>/src/manage-void-services/app/correct-summary-ticket/**/*.spec.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/manage-void-services/',
    '<rootDir>/src/add-request-new/',
  ],
  setupFilesAfterEnv : ['<rootDir>/test-setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  maxWorkers: 2,
  cacheDirectory: '<rootDir>/.jest-cache',
  //collectCoverageFrom: ['src/ab-white-list/**/*.ts'],
  coveragePathIgnorePatterns: ['.spec.ts', '.module.ts', 'src/polyfills.ts', 'main.ts', 'model.ts', 'query.ts', 'src/add-request-new'],
  coverageReporters: ['html', ['lcovonly', { 'projectRoot': '../../' }]],
  coverageDirectory: 'reports/coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  })
};