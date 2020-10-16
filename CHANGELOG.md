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
