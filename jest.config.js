module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./babel-jest.config.js" }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lucide-react|@heroicons/react)", // Allow these modules to be transformed
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};