/** @type {import('jest').Config} */
export default {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/config/**/*"
  ],
  coverageDirectory: "coverage"
};
