#### 2.3.11 (2021-07-02)

#### 2.3.10 (2021-06-17)

- added non essential folders to .npmignore to reduce the library size

#### 2.3.8 (2021-06-09)

- fixed getProps error message
- Added shadowDOm example

#### 2.3.7 (2021-05-08)

- fixed chaining with cy.get ([#182](https://github.com/abhinaba-ghosh/cypress-react-selector/pull/182)) ([338fdd57](https://github.com/abhinaba-ghosh/cypress-react-selector/commit/338fdd570a39cd5c5972d92eb9bb76405a8c2888))

#### 2.3.6 (2021-02-04)

- bug fix ([$136](https://github.com/abhinaba-ghosh/cypress-react-selector/issues/136))

#### 2.3.5 (2021-02-01)

- Updated Resq fetch mechanism. Refer: https://github.com/abhinaba-ghosh/cypress-react-selector/issues/94

#### 2.3.4 (2021-01-22)

- Handle type error of require.resolve being used in older version of node ([#133](https://github.com/abhinaba-ghosh/cypress-react-selector/pull/133)) ([81b5af4b](https://github.com/abhinaba-ghosh/cypress-react-selector/commit/81b5af4bb721aa1e52d60fe5144dfba52ce31584))

#### 2.3.3 (2021-01-19)

- Bugfix - https://github.com/abhinaba-ghosh/cypress-react-selector/issues/123

#### 2.3.2 (2021-01-19)

- Bugfix -https://github.com/abhinaba-ghosh/cypress-react-selector/issues/128

#### 2.3.1 (2021-01-17)

- Error message updated

### 2.3.0 (2021-01-16)

- Bug fix - https://github.com/abhinaba-ghosh/cypress-react-selector/issues/120
- Added support for passing `timeout` as object literal for react commands - https://github.com/abhinaba-ghosh/cypress-react-selector/issues/119
- Added support for fetch nthNode from RESQ nodes - https://github.com/abhinaba-ghosh/cypress-react-selector/issues/123

#### 2.2.2 (2020-12-15)

- Bug fix - https://github.com/abhinaba-ghosh/cypress-react-selector/pull/113

#### 2.2.1 (2020-11-19)

##### Bug Fixes

- Use require.resolve to find resq ([110af23f](https://github.com/abhinaba-ghosh/cypress-react-selector/commit/110af23fbc80c7c120ed43c0315fc9acfc68f25e))

### 2.2.0 (2020-10-16)

- Added `exact` flag support. If you are in need of matching exactly every property and value in the object (or nested objects), you can pass the exact flag to the `cy.react` or `cy.getReact` function:

```ts
cy.react('MyComponent', { props: { name: 'John' }, exact: true });
```

#### 2.1.1 (2020-10-15)

- `resq` upgraded to `1.9.1`. This unblocks the tests in production version.

### 2.1.0 (2020-10-11)

- bug fix for https://github.com/abhinaba-ghosh/cypress-react-selector/issues/48

- bug fix for https://github.com/abhinaba-ghosh/cypress-react-selector/issues/42

- retry `cy.react` and `cy.getReact` until node found ([4bb3207c](https://github.com/abhinaba-ghosh/cypress-react-selector/commit/4bb3207c00f84ee494433223db68d62e35f44cee))

#### 2.0.4 (2020-09-26)

- React logic updated with previous subject

```js
if (subject) {
  elements = window.resq.resq$$(component, subject[0]);
}
```

is now changed to -

```js
if (subject) {
  elements = window.resq.resq$$(component, subject);
}
```

#### 2.0.3 (2020-08-27)

- getIdentifierLogs not defined ([046562cd](https://github.com/abhinaba-ghosh/cypress-react-selector/commit/046562cdd12cfc290f6772552fd360070ceb73af))

#### 2.0.2 (2020-08-18)

- ES6 `import` and `export` changed to `exports.`

#### 2.0.1 (2020-08-15)

- `react root` selector configuration support added as a `cypress env` parameter

```json
{
  "env": {
    "cypress-react-selector": {
      "root": "#root"
    }
  }
}
```

- If the `root` found `undefined`, it will throw error messages and terminate the flow

## 2.0.0 (2020-08-15)

- From version 2.0 `cypress-react-selector` will be using `reactProps` object

V1.x way of proving react properties for identification

```js
cy.react('Product', { name: 'MacBook Pro' }, { orderCount: 2 });
```

in V2.x it will be:

```js
cy.react('Product', {
  props: { name: 'MacBook Pro' },
  state: { orderCount: 2 },
});
```

- `cy.react()` and `cy.getReact()` queries will retry itself until the upcoming assertion passes/timeouts
- If component not found, it will show helpful messages.
