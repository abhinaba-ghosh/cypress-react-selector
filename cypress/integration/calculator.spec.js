describe('It should validate cypress react selector', () => {
  before(() => {
    cy.visit('https://ahfarmer.github.io/calculator/');
    cy.waitForReact();
  });

  it('it should validate react selection with component only', () => {
    cy.react('t').should('have.length', '22');
  });

  it('it should validate react selection component and props', () => {
    cy.react('t', { name: '5' }).should('have.text', '5');
  });

  it('it should validate react selection with wildcard', () => {
    cy.react('*', { name: '9' }).should('have.text', '9');
  });

  it('it should validate react selection with cypress find command', () => {
    cy.react('t', { name: '5' }).find('button').should('have.text', '5');
  });

  it('should calculate 7 * 6', () => {
    cy.react('t', { name: '7' }).click();
    cy.react('t', { name: 'x' }).click();
    cy.react('t', { name: '6' }).click();
    cy.react('t', { name: '=' }).click();

    cy.get('.component-display').should('have.text', '42');
  });

  it('it should validate getProps with specific prop name', () => {
    cy.getReact('t', { name: '5' }).getProps('name').should('eq', '5');
  });

  it('it should validate getProps with no specific prop name', () => {
    cy.getReact('t', { name: '5' })
      .getProps()
      .then((props) => {
        expect(JSON.stringify(props)).to.contain('5');
      });
  });

  it('it should validate react chaining', () => {
    cy.react('t', { name: '5' }).react('button').should('have.text', '5');
  });

  it('it should validate chained react instances getProps with specific prop name', () => {
    cy.getReact('t')
      .getReact('t', { name: '5' })
      .getProps('name')
      .should('eq', '5');
  });
});
