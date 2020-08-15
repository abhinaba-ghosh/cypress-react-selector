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
