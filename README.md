# cypress-react-selector

[![Build Status](https://circleci.com/gh/abhinaba-ghosh/cypress-react-selector.svg?style=shield&branch-=master)](https://app.circleci.com/pipelines/github/abhinaba-ghosh/cypress-react-selector)
[![NPM release](https://img.shields.io/npm/v/cypress-react-selector.svg 'NPM release')](https://www.npmjs.com/package/cypress-react-selector)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![NPM Downloads](https://img.shields.io/npm/dt/cypress-react-selector.svg?style=flat-square)](https://www.npmjs.com/package/cypress-react-selector)

_cypress-react-selector_ is a lightweight plugin to help you to locate web elements in your REACT app using components, props and states. This extension allow you to select elements in a way that is native to React. Designed to help developers in component, integration and E2E testing.

Internally, cypress-react-selector uses a library called [resq](https://github.com/baruchvlz/resq) to query React's VirtualDOM in order to retrieve the nodes.

## Table of Contents

- [Install and configure](#install-and-configure)
  - [Add as a dependency:](#add-as-a-dependency-)
  - [Include the commands](#include-the-commands)
- [Highlights](#highlights)
- [Type Definition](#type-definition)
- [How to use React Selector?](#how-to-use-react-selector-)
  - [Wait for application to be ready to run tests](#wait-for-application-to-be-ready-to-run-tests)
  - [Find Element by React Component](#find-element-by-react-component)
  - [Element filtration by Props and States](#element-filtration-by-props-and-states)
  - [Wildcard selection](#wildcard-selection)
  - [Find element by nested props](#find-element-by-nested-props)
- [Get React Properties from element](#get-react-properties-from-element)
  - [Get Props](#get-props)
  - [Get current state](#get-current-state)
- [Timeouts](#timeouts)
- [Fetch indexed node](#fetch-indexed-node)
- [Use fluent chained queries](#use-fluent-chained-queries)
- [Sample Tests](#sample-tests)
- [Community Projects](#community-projects)
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

## Highlights

- cypress-react-selector supports NodeJS 8 or higher
- It supports React 16 or higher
- Retries each interaction until timeout to handle asynchronous calls
- Supports shadow DOM
- Supports wildcard selection for component names
- Supports nested Props
- Supports assertion on real-time react properties (props and states)

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

`cypress-react-selector` needs the react root `css-selector` information to identify

- Whether React has loaded
- Retry React identification queries if state changes in run time/React loads asynchronously

In order to make sure that the React component tree has loaded, add the `waitForReact` call immediately after loading a page. Here is an example where it's done in the fixture's `before` hook.

```js
before(() => {
  cy.visit('http://localhost:3000/myApp');
  cy.waitForReact(1000, '#root'); // 1000 is the timeout in milliseconds, you can provide as per AUT
});
```

_NOTE_ : The Best Configuration for React root is to declare it as an `env` variable

We always recommend to declare the `react root` as a `env` variable in the `cypress.json` file. It is a best approach rather than passing react root information to `waitForReact` method every time.

As an example:

```json
{
  "env": {
    "cypress-react-selector": {
      "root": "#root"
    }
  }
}
```

If you choose to declare the `root selector` as a `configuration`, then you will have the freedom to call `waitForReact` method without passing the root parameter.

```js
before(() => {
  cy.visit('http://localhost:3000/myApp');
  cy.waitForReact();
});
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
cy.react(componentName, reactOpts);

// ReactOpts:
//{
//  props: { someProp: someValue },
//  state: { someState: someValue },
//  exact: boolean
//}

// for the example APP
cy.react('MyComponent', { props: { name: 'John' } });
```

### Deep Matching with `exact` flag

If you are in need of matching exactly every property and value in the object (or nested objects), you can pass the exact flag to the `cy.react` or `cy.getReact` function:

```ts
cy.react('MyComponent', { props: { name: 'John' }, exact: true });
```

Make sure all the `props` and/or `state` are listed while using this `flag`, if not matched it will return `undefined`

### Wildcard selection

You can select your components by partial name use a wildcard selectors:

```ts
// Partial Match
cy.react('My*', { props: { name: 'John' } });

// Entire Match
cy.react('*', { props: { name: 'John' } }); // return all components matched with the prop
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
  cy.react('MyTextInput', { props: { field: { name: 'email' } } }).type(
    'john.doe@cypress.com'
  );
  cy.react('MyTextInput', { props: { field: { name: 'password' } } }).type(
    'whyMe?'
  );
});
```

## Get React Properties from element

Let's take same [Form example](#find-element-by-nested-props)

### Get Props

You can get the React properties from a React element and validate the properties run time.

```js
// set the email in the form
cy.react('MyTextInput', { props: { field: { name: 'email' } } }).type(
  'john.doe@cypress.com'
);

// validate the property runtime
cy.getReact('MyTextInput', { props: { field: { name: 'email' } } })
  .getProps('fields.value')
  .should('eq', 'john.doe@cypress.com');

// to get all the props, simply do not pass anything in getProps() method
cy.getReact('MyTextInput', { props: { field: { name: 'email' } } }).getProps();
```

![get-props](./docs/get-props.png)

### Get current state

```js
cy.getReact('MyTextInput', {
  props: { field: { name: 'email' } },
}).getCurrentState(); // can return string | boolean | any[] | {}
```

## Timeouts

You can configure the [timeouts](https://docs.cypress.io/guides/references/configuration.html#Timeouts) in the `cypress.json` configuration file. Alternatively, you can also pass the `timeout` as a object literal in the react commands like,

```js
cy.react('MyComponent', { options: { timeout: 50000 } });
```

## Fetch indexed node

1. `cy.react` returns DOM element, so you can fetch the indexed node by [.eq(index)](https://docs.cypress.io/api/commands/eq.html), like:

```js
cy.react('MyComponent').eq(0).click();
```

2. `cy.getReact()` return RESQ node, so you can't fetch it through `.eq()`. You need to use `.nthNode(index)`, like:

```js
cy.getReact('MyComponent')
  .nthNode(0)
  .getProps('name')
  .should('eq', 'First Item');
```

## Use fluent chained queries

You can chain `react-selector` queries like:

- combine with cypress native element `.find()` -

```js
cy.react('FormComponent').find('input').type('buy milk');
cy.react('FormComponent').find('button').click();
```

- fetch `HTMLElements` by chained `react` queries

```js
cy.react('MyComponent', { props: { name: 'Bob' } })
  .react('MyAge')
  .should('have.text', '50');
```

- fetch `react props and states` by chained `getReact` query

```js
cy.getReact('MyComponent', { props: { name: 'Bob' } })
  .getReact('MyAge')
  .getProps('age')
  .should('eq', '50');
```

:warning: Fluent commands are not working in some special cases. It is being tracked [here](https://github.com/abhinaba-ghosh/cypress-react-selector/issues/41)

## Sample Tests

- Checkout component testing use cases [here](./component/)
- Checkout e2e tests [here](./cypress/integration)

## Community Projects

- Credit goes to [Gleb Bahmutov](https://github.com/bahmutov) for drafting how `cypress-react-selector` can be used in `react component testing` [here](https://github.com/cypress-io/cypress/blob/develop/npm/react/cypress/component/advanced/react-book-example/src/components/ProductsList.spec.js)

- Credit goes to [gregfenton](https://github.com/gregfenton) for presenting a `formik form` example that uses `Cypress-React-Selector`. Checkout the work [here](https://github.com/gregfenton/example-cypress-react-selector-formik)

[If you have a cool project, feel free to portray here]

## Tool You Need

[React-Dev-Tool](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) — You can inspect the DOM element by simply pressing the f12. But, to inspect REACT components and props, you need to install the chrome plugin.

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/cypress-react-selector/issues)

## Contribution

Any pull request is welcome.

## Before you go

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/cypress-react-selector)! :star:
