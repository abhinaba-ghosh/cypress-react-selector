/**
 * We can output log messages in bold in Cypress using "**" notation -
 * but if we search for component by "*" we break it. Thus we need to escape
 * component names
 */
export const markupEscape = (s) => s.replace(/\*/g, '\\*');

/**
 * Convert props or state into pairs like key="value"
 */
export const serializeToLog = (props) =>
  Object.keys(props)
    .map((key) => `${key}=${JSON.stringify(props[key])}`)
    .join(' ');
