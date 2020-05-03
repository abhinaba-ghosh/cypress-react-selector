# cypress-react-selector

ReactJS is one of the most widely use Front-End libraries in the web. Along side React, many developers use styling tools that will minify or re-write the class attribute values attached to the HTML elements via className props in JSX. These modifications and overwrites make it difficult to select the generated HTML using the cypress query commands like find or get since it's not guaranteed that the class name will remain the same.

Worry Not! Here We Introduce **Cypress-React-Selector** :hatching_chick:

_cypress-react-selector_ is lightweight plugin to help you to locate web elements in your REACT app using components, props and states.

Internally, cypress-react-selector uses a library called [resq](https://github.com/baruchvlz/resq) to query React's VirtualDOM in order to retrieve the nodes.

## Install and configure

### Add as a dependency:

```sh
npm i --save cypress-react-selector
```

### Include the commands

Update `Cypress/support/index.js` file to include the cypress-axe commands by adding:

```js
import 'cypress-react-selector'
```

## Alert

- cypress-react-selector supports NodeJS 8 or higher
- Support added for IE, Chrome, Firefox, Safari (IE can break for some complex components)
- It supports React 16

## Type Definition

```ts
interface Chainable {
  react(component: string, props?: {}, state?: {}): Chainable<Element>
}
```

## How to use React Selector?

Lets take this example REACT APP:

```jsx
// imports

const MyComponent = ({ someBooleanProp }) => (
  <div>My Component {someBooleanProp ? 'show this' : ''} </div>
)

const App = () => (
  <div id='root'>
    <MyComponent />
    <MyComponent someBooleanProp={true} />
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

### Wait for application to be ready to run tests

To wait until the React's component tree is loaded, add the `waitForReact` method to fixture's `before` hook.

```js
before(() => {
  cy.visit('http://localhost:3000/myApp')
  cy.waitForReact()
})
```

this will wait to load react inside your app. By-default it will assume that the react root is set to '#root'. In the example above the id of the root element is set to 'root'. So, you don't need to pass the the root selector

The default timeout for `waitForReact` is `10000` ms. You can specify a custom timeout value:

```js
cy.waitForReact(30000)
```

### Wait to Load React for different react roots

It is always not true that the root of React app is set to 'root', may be your root element is 'mount', like:

```js
const App = () => (
  <div id='mount'>
    <MyComponent />
    <MyComponent someBooleanProp={true} />
  </div>
)
```

There is some application which displays react components asynchronously. The cypress-react-selector by-default assumes the react root element is set to 'root', if you have different root element, you need to pass that information to the react selector.

```ts
// if your react root is set to different selector other than 'root'
// then you don't need to pass root element information
cy.waitForReact(10000, '#mount')
```

### Find Element by React Component

You should have [React Develop Tool](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) installed to spy and find out the component name as sometimes components can go though modifications. Once the React gets loaded, you can easily identify an web element by react component name:

```js
cy.react('MyComponent')

// you can have your assertions chained like
it('it should validate react selection with component name', () => {
  cy.react('MyComponent').should('have.length', '1')
})
```

### Element filtration by Props and States

You can filter the REACT components by its props and states like below:

```ts
cy.react('MyComponent', { someBooleanProp: true }, { someBooleanState: true })
```

### Wildcard selection

You can select your components by partial name use a wildcard selectors:

```ts
// Partial Match
cy.react('My*', { someBooleanProp: true })

// Entire Match
cy.react('*', { someBooleanProp: true }) // return all components matched with the prop
```

## Sample Tests

Checkout sample tests [here](./cypress/integration)

## Tool You Need

[React-Dev-Tool](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) — You can inspect the DOM element by simply pressing the f12. But, to inspect REACT components and props, you need to install the chrome plugin.

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/cypress-react-selector/issues)

## Contribution

Any pull request is welcome.

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/cypress-react-selector)! :star:

_- Copyright &copy; 2019- [Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)_
