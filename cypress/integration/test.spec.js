/* eslint-disable */

// check react chained query bug
// https://github.com/abhinaba-ghosh/cypress-react-selector/issues/41
describe('It should validate cypress chained queries', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
    cy.waitForReact(2000, '#root');
  });

  // this test is currently failing
  it('it should validate chained react queries', () => {
    cy.react('House', { props: { house: 'House 1' } })
      .react('Cat')
      .should('have.length', '1');

    cy.react('House')
      .react('Cat', { props: { name: 'Tom' } })
      .should('have.length', '2');
  });

  it('it should validate chained getReact queries', () => {
    cy.getReact('House', { props: { house: 'House 1' } })
      .getReact('Cat')
      .getProps('name')
      .should('equal', 'Tom');
  });

  it('it should validate heterogeneous chained queries', () => {
    cy.react('House', { props: { house: 'House 1' } })
      .getReact('Cat')
      .getProps('name')
      .should('equal', 'Tom');
  });
});
