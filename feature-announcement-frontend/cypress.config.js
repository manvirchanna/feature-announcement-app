const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: '__tests__/cypress/integration/**/*.spec.{js,ts}',
    baseUrl: 'http://localhost:3000',
  },
});
