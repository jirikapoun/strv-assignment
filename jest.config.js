module.exports = {
  collectCoverage: true,
  coverageReporters: ["html"],
  maxWorkers: 1,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: "ts-jest",
  verbose: true,
}
