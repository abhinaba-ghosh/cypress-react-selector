const waitForReact = (timeout = 10000, reactRoot = "#root") => {
  cy.readFile("node_modules/resq/dist/index.js", "utf8", { log: false }).then(
    (script) => {
      cy.window({ log: false }).then({ timeout: timeout }, (win) => {
        win.eval(script);
        return new Cypress.Promise.resolve(
          win.resq.waitToLoadReact(timeout, reactRoot)
        )
          .then(() => {
            cy.log("[cypress-react-selector] loaded");
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
const markupEscape = (s) => s.replace(/\*/g, "\\*");

/**
 * Convert props or state into pairs like key="value"
 */
const serializeToLog = (props) =>
  Object.keys(props)
    .map((key) => `${key}=${JSON.stringify(props[key])}`)
    .join(" ");

const react = (component, props, state) => {
  let logMessage = `Finding **<${markupEscape(component)}`;
  if (props) {
    logMessage += " " + serializeToLog(props);
  }
  if (state) {
    logMessage += " " + serializeToLog(state);
  }

  logMessage += ">**";
  cy.log(logMessage);
  cy.window({ log: false }).then((window) => {
    if (!window.resq) {
      throw new Error(
        "React Selector not loaded yet. did you forget to run cy.waitForReact()?"
      );
    }
    let elements = window.resq.resq$$(component);
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

Cypress.Commands.add("waitForReact", waitForReact);
Cypress.Commands.add("react", react);
