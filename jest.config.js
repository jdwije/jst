module.exports = {
  verbose: true,
  transform: { '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js' },
  moduleFileExtensions: [ 'ts', 'tsx', 'js'],
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: [
    '/node_modules/',
    'd.ts',
  ]
};
