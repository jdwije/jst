module.exports = {
  "verbose": true,
  "transform": {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testMatch": [
    "**/*.(spec|test).(t|j)s?(x)"
  ],
  "testEnvironment": "node",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "coverageReporters": ['text', 'text-summary'],
  "coverageThreshold": {
    "global": { statements: 76, lines: 80, functions: 72 }
  },
  "testPathIgnorePatterns": [
    "/node_modules/"
  ]
};
