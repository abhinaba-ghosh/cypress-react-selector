import { getIdentifierLogs } from './logger';
import { safeStringify, getJsonValue, getType } from './utils';

/**
 * find react element by component, props and states
 * @param {*} component
 * @param {*} props
 * @param {*} state
 */
export const react = (subject, component, props, state) => {
  cy.log(`Finding ${getIdentifierLogs(component, props, state)}`);

  let elements;
  cy.window({ log: false }).then((window) => {
    if (!window.resq) {
      throw new Error(
        '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
      );
    }

    if (subject) {
      elements = window.resq.resq$$(component, subject[0]);
    } else {
      elements = window.resq.resq$$(component);
    }

    if (props) {
      elements = elements.byProps(props);
    }
    if (state) {
      elements = elements.byState(state);
    }
    if (!elements.length) {
      return [];
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
export const getReact = (subject, component, props, state) => {
  cy.log(`Finding ${getIdentifierLogs(component, props, state)}`);

  let elements;
  cy.window({ log: false }).then((window) => {
    if (!window.resq) {
      throw new Error(
        '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
      );
    }
    if (subject) {
      elements = window.resq.resq$$(component, subject[0].node);
    } else {
      elements = window.resq.resq$$(component);
    }
    if (props) {
      elements = elements.byProps(props);
    }
    if (state) {
      elements = elements.byState(state);
    }
    if (!elements.length) {
      throw new Error(
        `Component not found ${getIdentifierLogs(component, props, state)}`
      );
    }
    return elements;
  });
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 * @param {*} propName
 */
export const getProps = (subject, propName) => {
  if (!subject || !subject[0].props) {
    throw new Error('getProps() is a child command. Use with cy.getReact()');
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
      'getCurrentState() is a child command. Use with cy.getReact()'
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
