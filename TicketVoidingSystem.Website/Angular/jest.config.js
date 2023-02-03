const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
    //'<rootDir>/src/ab-white-list/**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/void-single-bet/app/tickets/group.model.spec.ts',
    '<rootDir>/src/void-single-bet/app/testing/',
    '<rootDir>/src/ticket-listing/app/advanced-mode-basketball/advanced-mode-basketball.component.spec.ts',
    '<rootDir>/src/utility/',
    '<rootDir>/src/void-formula-bets/',
    '<rootDir>/src/get-betid-for-voiding/',
    '<rootDir>/src/after-void-history/',
    '<rootDir>/src/add-request/app/add-request/filter/sub-issue-type-dialog/',
    '<rootDir>/src/add-request/app/add-request/league-event/',
    '<rootDir>/src/void-request/app/void-other-issue/',
    '<rootDir>/src/void-request/app/app.service.spec.ts',
  ],
  setupFilesAfterEnv : ['<rootDir>/src/test-setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  //collectCoverageFrom: ['src/ab-white-list/**/*.ts'],
  coveragePathIgnorePatterns: ['.spec.ts', '.module.ts', 'src/polyfills.ts', 'main.ts', 'model.ts', 'query.ts'],
  coverageReporters: ['html', ['lcovonly', { 'projectRoot': '../../' }]],
  coverageDirectory: 'reports/coverage',
  globals: {
    'ts-jest': {
      tsconfig: "<rootDir>/src/tsconfig.spec.json"
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  })
};