module.exports = {
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  globals: {
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder,
  },
};
