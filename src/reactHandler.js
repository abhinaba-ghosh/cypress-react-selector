import { getIdentifierLogs } from './logger';
import { safeStringify, getJsonValue, getType, getReactRoot } from './utils';

/**
 * find react element by component, props and states
 * @param {*} component
 * @param {*} props
 * @param {*} state
 */
export const react = (subject, component, reactOpts = {}, options = {}) => {
  if (subject === null) {
    throw new Error(`Previous component found null.`);
  }

  cy.log(
    `Finding ${getIdentifierLogs(component, reactOpts.props, reactOpts.state)}`
  );

  return cy.window({ log: false }).then((window) => {
    const isPrimitive = (x) =>
      Cypress._.isNumber(x) || Cypress._.isString(x) || Cypress._.isBoolean(x);

    const getNodes = () => {
      let elements;
      if (!window.resq) {
        throw new Error(
          '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
        );
      }

      if (subject) {
        elements = window.resq.resq$$(component, subject[0]);
      } else {
        if (getReactRoot(reactOpts.root)) {
          elements = window.resq.resq$$(
            component,
            document.querySelector(getReactRoot(reactOpts.root))
          );
        } else {
          elements = window.resq.resq$$(component);
        }
      }

      if (reactOpts.props) {
        elements = elements.byProps(reactOpts.props);
      }
      if (reactOpts.state) {
        elements = elements.byState(reactOpts.state);
      }
      if (!elements.length) {
        console.log(
          `Component not found ${getIdentifierLogs(
            component,
            reactOpts.props,
            reactOpts.state
          )}`
        );
        return null;
      }

      let nodes = [];
      elements.forEach((elm) => {
        var node = elm.node,
          isFragment = elm.isFragment;
        if (isFragment) {
          nodes = nodes.concat(node);
        } else {
          nodes.push(node);
        }
      });

      return nodes;
    };

    const resolveValue = () => {
      return new Cypress.Promise.try(getNodes).then((value) => {
        if (!isPrimitive(value)) {
          value = Cypress.$(value);
        }
        return cy.verifyUpcomingAssertions(value, options, {
          onRetry: resolveValue,
        });
      });
    };

    return resolveValue().then((value) => {
      return value;
    });
  });
};

/**
 * get react node (not actual element) by component, props and state
 * @param {*} component
 * @param {*} props
 * @param {*} state
 *
 * @example
 * React Node Type:
 *
 * interface RESQNode {
 *   name: 'MyComponent',
 *   node: HTMLElement | null,
 *   isFragment: boolean,
 *   state: string | boolean | any[] | {},
 *   props: {},
 *   children: RESQNode[]
 * }
 */
export const getReact = (subject, component, reactOpts = {}, options = {}) => {
  if (subject === null) {
    throw new Error(`Previous component found null.`);
  }
  cy.log(
    `Finding ${getIdentifierLogs(component, reactOpts.props, reactOpts.state)}`
  );

  return cy.window({ log: false }).then((window) => {
    const getNodes = () => {
      let elements;
      if (!window.resq) {
        throw new Error(
          '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
        );
      }

      if (subject) {
        elements = window.resq.resq$$(component, subject[0]);
      } else {
        if (getReactRoot(reactOpts.root)) {
          elements = window.resq.resq$$(
            component,
            document.querySelector(getReactRoot(reactOpts.root))
          );
        } else {
          elements = window.resq.resq$$(component);
        }
      }

      if (reactOpts.props) {
        elements = elements.byProps(reactOpts.props);
      }
      if (reactOpts.state) {
        elements = elements.byState(reactOpts.state);
      }
      if (!elements.length) {
        console.log(
          `Component not found ${getIdentifierLogs(
            component,
            reactOpts.props,
            reactOpts.state
          )}`
        );
        return null;
      }
      return elements;
    };

    const resolveValue = () => {
      return new Cypress.Promise.try(getNodes).then((value) => {
        return cy.verifyUpcomingAssertions(value, options, {
          onRetry: resolveValue,
        });
      });
    };

    return resolveValue().then((value) => {
      return value;
    });
  });
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 * @param {*} propName
 */
export const getProps = (subject, propName) => {
  if (!subject || !subject[0].props) {
    throw new Error(
      'Previous subject found null. getProps() is a child command. Use with cy.getReact()'
    );
  }
  if (subject.length > 1) {
    throw new Error(
      `getProps() works with single React Node. React Node found ${subject.length}`
    );
  }
  cy.log(`Finding value for prop **${propName || 'all props'}**`);
  cy.log(
    `Prop value found **${
      propName
        ? safeStringify(getJsonValue(subject[0].props, propName))
        : safeStringify(subject[0].props)
    }**`
  );
  const propValue = propName
    ? cy.wrap(getJsonValue(subject[0].props, propName))
    : cy.wrap(subject[0].props);
  return propValue;
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 * @param {*} propName
 */
export const getCurrentState = (subject) => {
  if (!subject || !subject[0].state) {
    throw new Error(
      'Previous subject found null. getCurrentState() is a child command. Use with cy.getReact()'
    );
  }
  if (subject.length > 1) {
    throw new Error(
      `getCurrentState() works with single React Node. React Node found ${subject.length}`
    );
  }
  cy.log(`Finding current state of the React component`);
  cy.log(
    `Current state found **${
      getType(subject[0].state) === 'object'
        ? safeStringify(subject[0].state)
        : subject[0].state
    }**`
  );
  return cy.wrap(subject[0].state);
};
