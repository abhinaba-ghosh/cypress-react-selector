describe('It should validate cypress react selector', () => {
  before(() => {
    cy.visit('https://ahfarmer.github.io/calculator/');
    cy.waitForReact(2000, '#root');
  });

  it('it should validate react selection with component only', () => {
    cy.get('.component-app').react('t').should('have.length', '21');
  });

  it('it should validate non calculator component should not exists', () => {
    cy.react('CalculatorCard').should('not.exist');
  });

  // below tests are currently failing due to https://github.com/baruchvlz/resq/issues/60
  it('it should validate react selection component and props', () => {
    cy.react('t', {
      props: { name: '5' },
    }).should('have.text', '5');
  });

  it('it should validate react selection with wildcard', () => {
    cy.react('*', { props: { name: '9' } }).should('have.text', '9');
  });

  it('it should validate react selection with cypress find command', () => {
    cy.react('t', { props: { name: '5' } })
      .find('button')
      .should('have.text', '5');
  });

  it('should calculate 7 * 6', () => {
    cy.react('t', { props: { name: '7' } }).click();
    cy.react('t', { props: { name: 'x' } }).click();
    cy.react('t', { props: { name: '6' } }).click();
    cy.react('t', { props: { name: '=' } }).click();

    cy.get('.component-display').should('have.text', '42');
  });

  it('it should validate getProps with specific prop name', () => {
    cy.getReact('t', { props: { name: '5' } })
      .getProps('name')
      .should('eq', '5');
  });

  it('it should validate getProps with no specific prop name', () => {
    cy.getReact('t', { props: { name: '5' } })
      .getProps()
      .then((props) => {
        expect(JSON.stringify(props)).to.contain('5');
      });
  });
  it('it should validate chained react instances getProps with specific prop name', () => {
    cy.getReact('t')
      .getReact('t', { props: { name: '5' } })
      .getProps('name')
      .should('eq', '5');
  });

  it('getReact should retry upcoming assertions', () => {
    const assertFn = cy.stub().returns(false);
    assertFn.onCall(5).returns(true);

    cy.getReact('t', { options: { timeout: 1000 } }).should(() => {
      // should retry 10 times

      const value = assertFn();
      expect(value).to.equal(true); // this should ultimately succeed at the 5th retry
    });
  });

  it('getReact should time out after failing assertions', () => {
    cy.on('fail', (err) => {
      if (err.message !== 'Timed out retrying after 1000ms: expected false to equal true') {
        throw err;
      }
    });

    cy.getReact('t', { options: { timeout: 1000 } }).should(() => {
      expect(false).to.equal(true);
    });
  });
});
