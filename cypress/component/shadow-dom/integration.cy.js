import React from 'react';
import App from './App';
import Web from './Web';

describe('It should validate cypress react selector with shadow dom', () => {
  beforeEach(() => {
    cy.mount(
      <div>
        <App />
        <Web />
      </div>
    );
    cy.waitForReact();

    // adding the shadow DOm config run-time
    Cypress.config('includeShadowDom', true);
  });

  it('verify text with react-selector with both components', () => {
    cy.react('App')
      .find('.shadow-host')
      .should('have.text', 'Shadow DOM Test App');
    cy.react('Web')
      .find('.shadow-host')
      .should('have.text', 'Shadow DOM Test Web');
  });
});
