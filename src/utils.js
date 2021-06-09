/**
 * safely handles circular references
 */
exports.safeStringify = (obj, indent = 2) => {
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
exports.getJsonValue = (o, s) => {
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
exports.getType = (p) => {
  if (Array.isArray(p)) return 'array';
  else if (typeof p == 'string') return 'string';
  else if (p != null && typeof p == 'object') return 'object';
  else return 'other';
};

/**
 * get the root element
 * @param {*} root
 */
exports.getReactRoot = (root) => {
  if (root) {
    return root;
  }

  if (Cypress.env('cypress-react-selector')) {
    return Cypress.env('cypress-react-selector').root;
  }

  return undefined;
};

/**
 * get runtime options
 */
exports.getDefaultCommandOptions = (reactOpts) => {
  return {
    timeout:
      ((reactOpts || {}).options || {}).timeout ||
      Cypress.config().defaultCommandTimeout,
  };
};

/**
 * Check if ReactOpts is valid
 * @param {Object} reactOpts
 */
exports.checkReactOptsIsValid = (reactOpts) => {
  const keys = Object.keys(reactOpts);
  const regexp = /^(?!props$|state|exact|options|root$).*/g;
  const atLeastOneMatches = keys.some((e) => regexp.test(e));
  if (keys.length > 3 || atLeastOneMatches) {
    return false;
  } else {
    return true;
  }
};

/**
 * Validate and get resq node for fetching props and states
 * @param {object || object[]} subject
 */
exports.getReactNode = (subject) => {
  if (!subject) {
    throw new Error(
      'Previous subject found null. getProps/getCurrentState is a child command. Use with cy.getReact()'
    );
  }
  if (
    Array.isArray(subject) &&
    (subject[0].props || subject[0].state) &&
    subject.length > 1
  ) {
    throw new Error(
      `getCurrentState/getProps works with single React Node. Number of React Node found ${subject.length}. Use nthNode(index) to fetch an unique react node`
    );
  }

  return Array.isArray(subject) ? subject[0] : subject;
};
