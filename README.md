# cypress-react-selector

[![Build Status](https://circleci.com/gh/abhinaba-ghosh/cypress-react-selector.svg?style=shield&branch-=master)](https://app.circleci.com/pipelines/github/abhinaba-ghosh/cypress-react-selector)
[![NPM release](https://img.shields.io/npm/v/cypress-react-selector.svg 'NPM release')](https://www.npmjs.com/package/cypress-react-selector)

_cypress-react-selector_ is a lightweight plugin to help you to locate web elements in your REACT app using components, props and states. This extension allow you to select page elements in a way that is native to React. This will help you in functional UI tests and E2E tests.

Internally, cypress-react-selector uses a library called [resq](https://github.com/baruchvlz/resq) to query React's VirtualDOM in order to retrieve the nodes.

## Table of Contents

- [Install and configure](#install-and-configure)
  - [Add as a dependency:](#add-as-a-dependency-)
  - [Include the commands](#include-the-commands)
- [Alert](#alert)
- [Type Definition](#type-definition)
- [How to use React Selector?](#how-to-use-react-selector-)
  - [Wait for application to be ready to run tests](#wait-for-application-to-be-ready-to-run-tests)
  - [Wait to Load React for different react roots](#wait-to-load-react-for-different-react-roots)
  - [Find Element by React Component](#find-element-by-react-component)
  - [Element filtration by Props and States](#element-filtration-by-props-and-states)
  - [Wildcard selection](#wildcard-selection)
  - [Find element by nested props](#find-element-by-nested-props)
- [Get React Properties from element](#get-react-properties-from-element)
  - [Get Props](#get-props)
  - [Get current state](#get-current-state)
- [Use fluent chained queries](#use-fluent-chained-queries)
- [Sample Tests](#sample-tests)
- [Sample Example Project](#sample-example-project)
- [Tool You Need](#tool-you-need)
- [Tell me your issues](#tell-me-your-issues)
- [Contribution](#contribution)

## Install and configure

### Add as a dependency:

```sh
npm i --save cypress-react-selector
```

### Include the commands

Update `Cypress/support/index.js` file to include the cypress-react-selector commands by adding:

```js
import 'cypress-react-selector';
```

### TSConfig Settings for types

```js
{
  "compilerOptions": {
    "sourceType": "module",
    "types": ["node", "cypress", "cypress-react-selector"]
  }
}
```

## Alert

- cypress-react-selector supports NodeJS 8 or higher
- It supports React 16 or higher

## Type Definition

```ts
interface Chainable {
  react(component: string, props?: {}, state?: {}): Chainable<Element>;
}
```

## How to use React Selector?

Lets take this example REACT APP:

```jsx
// imports

const MyComponent = ({ someBooleanProp }) => (
  <div>My Component {someBooleanProp ? 'show this' : ''} </div>
);

const App = () => (
  <div id="root">
    <MyComponent />
    <MyComponent someBooleanProp={true} />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### Wait for application to be ready to run tests

To wait until the React's component tree is loaded, add the `waitForReact` method to fixture's `before` hook.

```js
before(() => {
  cy.visit('http://localhost:3000/myApp');
  cy.waitForReact();
});
```

this will wait to load react inside your app. `waitForReact` automatically find out the react root of your application.

The default timeout for `waitForReact` is `10000` ms. You can specify a custom timeout value:

```js
cy.waitForReact(30000);
```

### Wait to Load React for different react roots

It may even possible that you have different REACT roots (different REACT instances in same application). In this case, you can specify the `CSS Selector` of the target `root`.

```js
const App = () => (
  <div id="mount">
    <MyComponent />
    <MyComponent name={'John'} />
  </div>
);
```

There is some application which displays react components asynchronously. You need to pass `root selector` information to the react selector.

```ts
// if your react root is set to different selector other than 'root'
// then you don't need to pass root element information
cy.waitForReact(10000, '#mount');
```

### Find Element by React Component

You should have [React Develop Tool](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) installed to spy and find out the component name as sometimes components can go though modifications. Once the React gets loaded, you can easily identify an web element by react component name:

```js
cy.react('MyComponent');

// you can have your assertions chained like
it('it should validate react selection with component name', () => {
  cy.react('MyComponent').should('have.length', '1');
});
```

### Element filtration by Props and States

You can filter the REACT components by its props and states like below:

```ts
cy.react(componentName, { propName: propValue }, { stateName: stateValue });

// for the example APP
cy.react('MyComponent', { name: 'John' });
```

### Wildcard selection

You can select your components by partial name use a wildcard selectors:

```ts
// Partial Match
cy.react('My*', { name: 'John' });

// Entire Match
cy.react('*', { name: 'John' }); // return all components matched with the prop
```

### Find element by nested props

Let's suppose you have an Form component

```js
<Form>
  <Field name="email" type="email" component={MyTextInput} />
  <ErrorMessage name="email" component="div" />
  <br />
  <Field type="password" name="password" component={MyTextInput} />
  <ErrorMessage name="password" component="div" />
  <br />
  <button type="submit" disabled={isSubmitting}>
    Submit
  </button>
</Form>
```

And _**MyTextInput**_ component is developed as:

```js
const MyTextInput = (props) => {
  const { field, type } = props;

  return (
    <input {...field} type={type} placeholder={'ENTER YOUR ' + field.name} />
  );
};
```

then you can use cypress-react-selector to identify the element with nested props

```js
it('enter data into the fields', () => {
  cy.react('MyTextInput', { field: { name: 'email' } }).type(
    'john.doe@cypress.com'
  );
  cy.react('MyTextInput', { field: { name: 'password' } }).type('whyMe?');
});
```

## Get React Properties from element

Let's take same [Form example](#find-element-by-nested-props)

### Get Props

You can get the React properties from a React element and validate the properties run time.

```js
// set the email in the form
cy.react('MyTextInput', { field: { name: 'email' } }).type(
  'john.doe@cypress.com'
);

// validate the property runtime
cy.getReact('MyTextInput', { field: { name: 'email' } })
  .getProps('fields.value')
  .should('eq', 'john.doe@cypress.com');

// to get all the props, simply do not pass anything in getProps() method
cy.getReact('MyTextInput', { field: { name: 'email' } }).getProps();
```

![get-props](./docs/get-props.png)

### Get current state

```js
cy.getReact('MyTextInput', { field: { name: 'email' } }).getCurrentState(); // can return string | boolean | any[] | {}
```

## Use fluent chained queries

You can chain `react-selector` queries like:

- fetch `HTMLElements` by chained `react` queries

```js
cy.react('MyComponent', { name: 'Bob' })
  .react('MyAge')
  .should('have.text', '50');
```

- fetch `react props and states` by chained `getReact` query

```js
cy.getReact('MyComponent', { name: 'Bob' })
  .getReact('MyAge')
  .getProps('age')
  .should('eq', '50');
```

## Sample Tests

Checkout sample tests [here](./cypress/integration)

Use [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) plugin to easily identify the react component, props and state. Have a look in the below demonstration, how I have used the tool to write the sample test cases.

![react-dev-tools](./docs/cy-react-dev-tool.gif)

## Sample Example Project

Credit goes to [gregfenton](https://github.com/gregfenton) for presenting a great example that uses Cypress-React-Selector. Checkout the work [here](https://github.com/gregfenton/example-cypress-react-selector-formik)

## Tool You Need

[React-Dev-Tool](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) — You can inspect the DOM element by simply pressing the f12. But, to inspect REACT components and props, you need to install the chrome plugin.

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/cypress-react-selector/issues)

## Contribution

Any pull request is welcome.

## Before you go

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/cypress-react-selector)! :star:

[Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)\_
