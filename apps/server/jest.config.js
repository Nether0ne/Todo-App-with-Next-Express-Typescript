/* eslint-disable */
const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper,
};
