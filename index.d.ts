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

  interface reactOpts {
    props: {};
    state: {};
    root: string;
  }
  interface Chainable {
    /**
     * Wait until the React's component tree is loaded. Call `cy.waitForReact()` in your test's `before` hook.
     * @example
     * before(() => {
     *  cy.visit('http://localhost:3000/myApp');
     *  cy.waitForReact();
     * });
     *
     * @param timeout
     * @param reactRoot
     */
    waitForReact(timeout?: number, reactRoot?: string): void;

    /**
     * Get react elements by component, props and states
     * @see https://github.com/abhinaba-ghosh/cypress-react-selector/blob/master/cypress/integration/react-selector.spec.js
     * @example
     * cy.react(`MyComponent`).should('have.length', 10)
     * cy.react('MyComponent',{name:'Bill'}).should('have.length', 1)
     */
    react<E extends Node = HTMLElement>(
      component: string,
      reactOpts?: {
        props?: object;
        state?: object;
        exact?: boolean;
        root?: string;
        options?: Partial<Loggable & Timeoutable>;
      }
    ): Chainable<JQuery<E>>;

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
    getReact(
      component: string,
      reactOpts?: {
        props?: object;
        state?: object;
        exact?: boolean;
        root?: string;
        options?: Partial<Loggable & Timeoutable>;
      }
    ): Chainable<RESQNode>;

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

    /**
     * Get the nthNode using index
     * @param index
     *
     * @example
     * cy.getReact('Product').nthNode(0).getProps('name').should('eq', 'First item');
     */
    nthNode(index: number): Chainable<any>;
  }
}
