// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// const findReactScriptsWebpackConfig = require('@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig');
// const { startDevServer } = require('@cypress/webpack-dev-server');
// const _ = require('lodash');

// module.exports = (on, config) => {
//   const webpackConfig = findReactScriptsWebpackConfig(config);

//   // const rules = webpackConfig.module.rules.find((rule) => !!rule.oneOf).oneOf;
//   // const babelRule = rules.find((rule) => /babel-loader/.test(rule.loader));
//   // babelRule.options.plugins.push(require.resolve('babel-plugin-istanbul'));

//   on('dev-server:start', (options) => {
//     return startDevServer({ options, webpackConfig });
//   });

//   // IMPORTANT to return the config object
//   // with the any changed environment variables
//   return config;
// };

const injectDevServer = require('@cypress/react/plugins/react-scripts');

module.exports = (on, config) => {
  injectDevServer(on, config);
  return config;
};
