/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Get react elements by component, props and states
     * @see https://github.com/abhinaba-ghosh/cypress-react-selector/blob/master/cypress/integration/react-selector.spec.js
     * @example
     * cy.react(`MyComponent`).should('have.length', 10)
     * cy.react('MyComponent',{name:'Bill'}).should('have.length', 1)
     */
    react(component: string, props?: {}, state?: {}): Chainable<Element>
  }
}
