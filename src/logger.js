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
export const getIdentifierLogs = (component, props, state) => {
  let logMessage = `**<${markupEscape(component)}`;
  if (props) {
    logMessage += ' ' + serializeToLog(props);
  }
  if (state) {
    logMessage += ' ' + serializeToLog(state);
  }

  logMessage += '>**';
  return logMessage;
};
