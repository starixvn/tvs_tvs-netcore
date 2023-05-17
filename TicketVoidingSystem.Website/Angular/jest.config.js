const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  testResultsProcessor: 'jest-sonar-reporter',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
    //'<rootDir>/src/mark-tickets/app/mark-unmark-ticket/filter-tickets/match-id/match-id.component.spec.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/manage-void-services/',
    // '<rootDir>/src/utility/',
  ],
  setupFilesAfterEnv : ['<rootDir>/setup.jest.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  //collectCoverageFrom: ['src/ab-white-list/**/*.ts'],
  coveragePathIgnorePatterns: ['.spec.ts', '.module.ts', 'src/polyfills.ts', 'main.ts', 'model.ts', 'query.ts'],
  coverageReporters: ['html', ['lcovonly', { 'projectRoot': '../../' }]],
  coverageDirectory: 'reports/coverage',
  globals: {
    'ts-jest': {
      tsconfig: "<rootDir>/tsconfig.spec.json"
    }
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  })
};