/// <reference types="cypress" />

declare namespace Cypress {
  interface RESQNode {
    name: string;
    node: HTMLElement | null;
    isFragment: boolean;
    state: string | boolean | any[] | {};
    props: {};
    children: RESQNode[];
  }
  interface Chainable {
    /**
     * Get react elements by component, props and states
     * @see https://github.com/abhinaba-ghosh/cypress-react-selector/blob/master/cypress/integration/react-selector.spec.js
     * @example
     * cy.react(`MyComponent`).should('have.length', 10)
     * cy.react('MyComponent',{name:'Bill'}).should('have.length', 1)
     */
    react(component: string, props?: {}, state?: {}): Chainable<any>;

    /**
     * Get React Node by component, props and state
     *
     * @example
     * cy.getReact('MyComponent')
     * cy.getReact('MyComponent',{name:'Bill'})
     * @param component
     * @param props
     * @param state
     */
    getReact(component: string, props?: {}, state?: {}): Chainable<RESQNode>;

    /**
     * Get prop value from React Node.
     * @note
     * This method should always be used with getReact() method
     * @param propName
     *
     * @example
     * cy.getReact('MyForm',{name:'email'}).getProps('value').should('eq','john.doe@cypress.com')
     *
     * to get all props
     * cy.getReact('MyForm',{name:'email'}).getProps()
     */
    getProps(propName?: string): Chainable<any>;

    /**
     * Get current state from React Node.
     *  @note
     * This method should always be used with getReact() method
     */
    getCurrentState(): Chainable<any>;
  }
}
