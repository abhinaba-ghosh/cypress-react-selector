const { getReactRoot } = require('./utils');

/**
 * wait for react to be loaded
 * @param {*} timeout
 * @param {*} reactRoot
 */
exports.waitForReact = (timeout = 10000, reactRoot, resqModulePath) => {
  const file = require.hasOwnProperty('resolve')
    ? require.resolve('resq')
    : 'node_modules/resq/dist/index.js';

  // If the user passes in a resq path, use that instead
  const resqPath = resqModulePath || file;

  cy.readFile(resqPath, 'utf8', {
    log: false,
  }).then((script) => {
    cy.window({ log: false }).then({ timeout: timeout }, (win) => {
      if (Cypress.testingType === 'component') {
        global.isReactLoaded = false;
      }
      win.eval(script);
      return new Cypress.Promise.resolve(
        win.resq.waitToLoadReact(timeout, getReactRoot(reactRoot))
      )
        .then(() => {
          cy.log('[cypress-react-selector] loaded');
        })
        .catch((err) => {
          throw new Error(
            `[cypress-react-selector] root found as ${reactRoot}. It is not valid root for your application. \n
              > Make sure to declare root selector as a configuration [recommended]\n
              > or Pass as a parameter to waitForReact() method`
          );
        });
    });
  });
};
