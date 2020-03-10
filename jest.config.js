module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
  coverageReporters: ["html", "text-summary"],
  snapshotSerializers: ["jest-serializer-vue"]
};
