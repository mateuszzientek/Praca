module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/?!(react-icons)"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
