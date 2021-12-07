module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/src/domain/**',
    '!**/protocols/**', '!**/test/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb'
}
