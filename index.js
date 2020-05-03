const waitForReact = (timeout = 10000, reactRoot = '#root') => {
  cy.readFile('node_modules/resq/dist/index.js', 'utf8').then(script => {
    cy.window({ log: false }).then({ timeout: timeout }, win => {
      win.eval(script)
      return new Cypress.Promise.resolve(
        win.resq.waitToLoadReact(timeout, reactRoot)
      )
        .then(() => {
          cy.log('react loaded')
        })
        .catch(err => {
          cy.log(`react root ${reactRoot} is not valid for your application`)
        })
    })
  })
}

const react = (component, props, state) => {
  cy.window().then(window => {
    if (!window.resq) {
      throw new Error(
        'React Selector not loaded yet. did you forget to run cy.waitToLoadReact()?'
      )
    }
    let elements = window.resq.resq$$(component)
    if (props) {
      elements = elements.byProps(props)
    }
    if (state) {
      elements = elements.byState(state)
    }
    if (!elements.length) {
      return []
    }
    let nodes = []
    elements.forEach(elm => {
      var node = elm.node,
        isFragment = elm.isFragment
      if (isFragment) {
        nodes = nodes.concat(node)
      } else {
        nodes.push(node)
      }
    })
    return nodes
  })
}

Cypress.Commands.add('waitForReact', waitForReact)
Cypress.Commands.add('react', react)
