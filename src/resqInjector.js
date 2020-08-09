/**
 * wait for react to be loaded
 * @param {*} timeout
 * @param {*} reactRoot
 */
export const waitForReact = (timeout = 10000, reactRoot) => {
  cy.readFile('node_modules/resq/dist/index.js', 'utf8', { log: false }).then(
    (script) => {
      cy.window({ log: false }).then({ timeout: timeout }, (win) => {
        win.eval(script);
        return new Cypress.Promise.resolve(
          win.resq.waitToLoadReact(timeout, reactRoot)
        )
          .then(() => {
            cy.log('[cypress-react-selector] loaded');
          })
          .catch((err) => {
            cy.log(
              `[cypress-react-selector] root ${reactRoot} is not valid for your application`
            );
          });
      });
    }
  );
};
