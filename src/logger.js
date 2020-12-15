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
 * Log the component identifier messages
 * @param {*} component
 * @param {*} props
 * @param {*} state
 */
const getIdentifierLogs = (exports.getIdentifierLogs = (
  component,
  props,
  state
) => {
  let logMessage = `**<${markupEscape(component)}`;
  if (props) {
    logMessage += ' ' + serializeToLog(props);
  }
  if (state) {
    logMessage += ' ' + serializeToLog(state);
  }

  logMessage += '>**';
  return logMessage;
});

/**
 * get the component not found error logs
 * @param {*} component
 * @param {*} props
 * @param {*} state
 */
exports.getComponentNotFoundMessage = (component, props, state) => {
  const message = `**Component not found ${getIdentifierLogs(
    component,
    props,
    state
  )}**\n\n
  
  There can be multiple reasons for it.\n
  > Component never meant to exists. You are good to go. 
  > Check the root is defined as a env parameter (cypress.json config file).\n
  > If the root is defined correctly, check other parameters - component name, props and state objects\n
  
  Or, raise an issue with proper code samples here: https://github.com/abhinaba-ghosh/cypress-react-selector/issues`;
  return message;
};
