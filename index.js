/**
 * wait for react to be loaded
 * @param {*} timeout
 * @param {*} reactRoot
 */
const waitForReact = (timeout = 10000, reactRoot) => {
  cy.readFile('node_modules/resq/dist/index.js', 'utf8', { log: false }).then(
    (script) => {
      cy.window({ log: false }).then({ timeout: timeout }, (win) => {
        win.eval(script);
        return new Cypress.Promise.resolve(
          win.resq.waitToLoadReact(timeout, reactRoot)
        )
          .then(() => {
            cy.log('[cypress-react-selector] loaded');
          })
          .catch((err) => {
            cy.log(
              `[cypress-react-selector] root ${reactRoot} is not valid for your application`
            );
          });
      });
    }
  );
};

/**
 * We can output log messages in bold in Cypress using "**" notation -
 * but if we search for component by "*" we break it. Thus we need to escape
 * component names
 */
const markupEscape = (s) => s.replace(/\*/g, '\\*');

/**
 * Convert props or state into pairs like key="value"
 */
const serializeToLog = (props) =>
  Object.keys(props)
    .map((key) => `${key}=${JSON.stringify(props[key])}`)
    .join(' ');

/**
 * find react element by component, props and states
 * @param {*} component
 * @param {*} props
 * @param {*} state
 */
const react = (subject, component, props, state) => {
  cy.log('subject: ' + subject + ', component: ' + component + ', props: ' + JSON.stringify(props) + ', state: ' + state);
  const startTime = Date.now();
  let logMessage = `Finding **<${markupEscape(component)}`;
  let elements;
  if (props) {
    logMessage += ' ' + serializeToLog(props);
  }
  if (state) {
    logMessage += ' ' + serializeToLog(state);
  }

  logMessage += '>**';
  cy.log(logMessage);

  cy.window({ log: false }).then((window) => {
    return new Promise(((resolve, reject) => {
      const tryFind = () => {
        if (!window.resq) {
          reject(new Error(
            '[cypress-react-selector] not loaded yet. did you forget to run cy.waitForReact()?'
          ));
          return;
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
          if ((Date.now() - startTime) >= Cypress.config('defaultCommandTimeout')) {
            reject(new Error(`React Cypress query timed out after ${Cypress.config('defaultCommandTimeout')}ms.`))
            return;
          }
          setTimeout(tryFind, 250);
          return;
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
        resolve(nodes);
      };
      tryFind();
    }));
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
const getReact = (subject, component, props, state) => {
  let logMessage = `Finding **<${markupEscape(component)}`;
  if (props) {
    logMessage += ' ' + serializeToLog(props);
  }
  if (state) {
    logMessage += ' ' + serializeToLog(state);
  }

  logMessage += '>**';
  cy.log(logMessage);

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
      return [];
    }

    return elements;
  });
};

/**
 * get all props or specific props from react node
 * @param {*} subject
 * @param {*} propName
 */
const getProps = (subject, propName) => {
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
        ? JSON.safeStringify(getJsonValue(subject[0].props, propName))
        : JSON.safeStringify(subject[0].props)
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
const getCurrentState = (subject) => {
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
        ? JSON.safeStringify(subject[0].state)
        : subject[0].state
    }**`
  );
  return cy.wrap(subject[0].state);
};

/**
 * safely handles circular references
 */
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === 'object' && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};

/**
 * get json value by string keys
 * @param {*} object
 * @param {*} keys
 */
const getJsonValue = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, '.$1');
  s = s.replace(/^\./, '');
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

/**
 * get the type of the object
 * @param {*} p
 */
const getType = (p) => {
  if (Array.isArray(p)) return 'array';
  else if (typeof p == 'string') return 'string';
  else if (p != null && typeof p == 'object') return 'object';
  else return 'other';
};

// add cypress custom commands
Cypress.Commands.add('waitForReact', waitForReact);
Cypress.Commands.add('react', { prevSubject: ['optional', 'element'] }, react);
Cypress.Commands.add('getReact', { prevSubject: 'optional' }, getReact);
Cypress.Commands.add('getProps', { prevSubject: true }, getProps);
Cypress.Commands.add('getCurrentState', { prevSubject: true }, getCurrentState);
