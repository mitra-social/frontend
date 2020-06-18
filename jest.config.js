module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,vue}"],
  coverageReporters: ["html", "text-summary", "lcov"],
  coverageDirectory: "./build/coverage",
  snapshotSerializers: ["jest-serializer-vue"],
  moduleNameMapper: {
    apiClient: "<rootDir>/src/api-client/mock",
  },
  transformIgnorePatterns: ["/node_modules/(?!activitypub-objects).+\\.js$"],
};
