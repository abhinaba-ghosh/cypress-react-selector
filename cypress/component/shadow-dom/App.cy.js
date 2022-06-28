import React from 'react';
import App from './App';

describe('It should validate cypress react selector with shadow dom', () => {
  beforeEach(() => {
    cy.mount(<App />);
    cy.waitForReact();

    // adding the shadow DOm config run-time
    Cypress.config('includeShadowDom', true);
  });

  it('verify text natively', () => {
    cy.get('.shadow-host').should('have.text', 'Shadow DOM Test App');
  });

  it('verify text with react-selector', () => {
    cy.react('App')
      .find('.shadow-host')
      .should('have.text', 'Shadow DOM Test App');
  });
});
