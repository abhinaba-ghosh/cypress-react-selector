const { getComponentNotFoundMessage, getIdentifierLogs } = require('./logger');
const {
  safeStringify,
  getJsonValue,
  getType,
  getReactRoot,
  getDefaultCommandOptions,
  checkReactOptsIsValid,
  getReactNode,
} = require('./utils');

/**
 * find react element by component, props and states
 * @param {String} component
 * @param {Object} reactOpts
 * @param {Object} options
 */
exports.react = (subject, component, reactOpts = {}) => {
  if (subject === null) {
    throw new Error(`Previous component found null.`);
  }

  if (reactOpts && !checkReactOptsIsValid(reactOpts)) {
    throw new Error(
      `ReactOpts is not valid. Valid keys are props,state,exact,root,options.`
    );
  }

  let contextNode;
  let withinSubject = cy.state('withinSubject');

  if (Cypress.dom.isElement(subject)) {
    contextNode = subject[0];
  } else if (Cypress.dom.isDocument(subject)) {
    contextNode = subject;
  } else if (withinSubject) {
    contextNode = withinSubject[0];
  } else {
    contextNode = cy.state('window').document;
  }

  cy.log(
    `Finding ${getIdentifierLogs(component, reactOpts.props, reactOpts.state)}`
  );

  // set the retry configuration
  let retryInterval = 100;
  let retries = Math.floor(
    getDefaultCommandOptions(reactOpts).timeout / retryInterval
  );
  const isPrimitive = (x) =>
    Cypress._.isNumber(x) || Cypress._.isString(x) || Cypress._.isBoolean(x);

  const _nodes = () => {
    return cy
      .window({ log: false })
      .then(
        { timeout: getDefaultCommandOptions(reactOpts).timeout + 100 },
        (window) => {
          let elements;
          if (!window.resq) {
            throw new Error(
              '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
            );
          }

          if (subject) {
            elements = window.resq.resq$$(component, contextNode);
          } else {
            if (getReactRoot(reactOpts.root) !== undefined) {
              elements = window.resq.resq$$(
                component,
                document.querySelector(getReactRoot(reactOpts.root))
              );
            } else {
              elements = window.resq.resq$$(component);
            }
          }

          if (reactOpts.props) {
            elements = elements.byProps(reactOpts.props, {
              exact: reactOpts.exact,
            });
          }
          if (reactOpts.state) {
            elements = elements.byState(reactOpts.state, {
              exact: reactOpts.exact,
            });
          }
          if (!elements.length) {
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
        }
      );
  };

  const resolveValue = () => {
    return _nodes().then((value) => {
      if (!value) {
        if (retries < 1) {
          cy.log(
            getComponentNotFoundMessage(
              component,
              reactOpts.props,
              reactOpts.state
            )
          );
          return;
        }

        return cy
          .wait(retryInterval, {
            log: false,
          })
          .then(() => {
            retries--;
            return resolveValue();
          });
      }
      if (!isPrimitive(value)) {
        value = Cypress.$(value);
      }
      return cy.verifyUpcomingAssertions(value, (reactOpts || {}).options, {
        onRetry: resolveValue,
      });
    });
  };

  return resolveValue().then((value) => {
    return value;
  });
};

/**
 * get react node (not actual element) by component, props and state
 * @param {string} component
 * @param {Object} reactOpts
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
exports.getReact = (subject, component, reactOpts = {}) => {
  if (subject === null) {
    throw new Error(`Previous component found null.`);
  }

  if (reactOpts && !checkReactOptsIsValid(reactOpts)) {
    throw new Error(
      `ReactOpts is not valid. Valid keys are props,state,exact,root,options.`
    );
  }

  let contextNode;
  let withinSubject = cy.state('withinSubject');

  if (Cypress.dom.isElement(subject)) {
    contextNode = subject[0];
  } else if (Cypress.dom.isDocument(subject)) {
    contextNode = subject;
  } else if (withinSubject) {
    contextNode = withinSubject[0];
  } else {
    contextNode = cy.state('window').document;
  }

  cy.log(
    `Finding ${getIdentifierLogs(component, reactOpts.props, reactOpts.state)}`
  );

  // set the retry configuration
  let retryInterval = 100;
  let retries = Math.floor(
    getDefaultCommandOptions(reactOpts).timeout / retryInterval
  );

  const _nodes = () => {
    return cy.window({ log: false }).then(
      {
        timeout: getDefaultCommandOptions(reactOpts).timeout + 100,
      },
      (window) => {
        let elements;
        if (!window.resq) {
          throw new Error(
            '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
          );
        }

        if (subject) {
          elements = window.resq.resq$$(component, contextNode);
        } else {
          if (getReactRoot(reactOpts.root) !== undefined) {
            elements = window.resq.resq$$(
              component,
              document.querySelector(getReactRoot(reactOpts.root))
            );
          } else {
            elements = window.resq.resq$$(component);
          }
        }

        if (reactOpts.props) {
          elements = elements.byProps(reactOpts.props, {
            exact: reactOpts.exact,
          });
        }
        if (reactOpts.state) {
          elements = elements.byState(reactOpts.state, {
            exact: reactOpts.exact,
          });
        }
        if (!elements.length) {
          return null;
        }
        return elements;
      }
    );
  };
  const resolveValue = () => {
    return _nodes().then((value) => {
      if (!value) {
        if (retries < 1) {
          cy.log(
            getComponentNotFoundMessage(
              component,
              reactOpts.props,
              reactOpts.state
            )
          );
          return;
        }
        return cy
          .wait(retryInterval, {
            log: false,
          })
          .then(() => {
            retries--;
            return resolveValue();
          });
      }
      return cy.verifyUpcomingAssertions(value, (reactOpts || {}).options, {
        onRetry: resolveValue,
      });
    });
  };

  return resolveValue().then((value) => {
    return value;
  });
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 * @param {*} propName
 */
exports.getProps = (subject, propName) => {
  const reactNode = getReactNode(subject);
  cy.log(`Finding value for prop **${propName || 'all props'}**`);
  cy.log(
    `Prop value found **${
      propName
        ? safeStringify(getJsonValue(reactNode.props, propName))
        : safeStringify(reactNode.props)
    }**`
  );
  const propValue = propName
    ? cy.wrap(getJsonValue(reactNode.props, propName))
    : cy.wrap(reactNode.props);
  return propValue;
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 */
exports.getCurrentState = (subject) => {
  const reactNode = getReactNode(subject);
  cy.log(`Finding current state of the React component`);
  cy.log(
    `Current state found **${
      getType(reactNode.state) === 'object'
        ? safeStringify(reactNode.state)
        : reactNode.state
    }**`
  );
  return cy.wrap(reactNode.state);
};

/**
 *  Get nth Node
 * @param {object} subject
 * @param {number} pos
 */
exports.nthNode = (subject, pos) => cy.wrap(subject).then((e) => e[pos]);
