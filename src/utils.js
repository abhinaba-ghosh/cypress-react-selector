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

  if (Cypress.env()['cypress-react-selector']) {
    return Cypress.env()['cypress-react-selector'].root;
  }

  return undefined;
};

/**
 * get runtime options
 */
exports.getDefaultCommandOptions = () => {
  return {
    timeout: Cypress.config().defaultCommandTimeout,
  };
};
