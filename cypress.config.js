const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  env: {
    'cypress-react-selector': {
      root: '#__cy_root',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: 'cypress/e2e/**/*.spec.{js,ts,jsx,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'component/**/*.spec.{js,ts,jsx,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
