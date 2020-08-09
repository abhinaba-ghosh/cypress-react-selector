import { waitForReact } from './src/resqInjector';
import { react, getReact, getProps, getCurrentState } from './src/reactHandler';

// add cypress custom commands
Cypress.Commands.add('waitForReact', waitForReact);
Cypress.Commands.add('react', { prevSubject: ['optional', 'element'] }, react);
Cypress.Commands.add('getReact', { prevSubject: 'optional' }, getReact);
Cypress.Commands.add('getProps', { prevSubject: true }, getProps);
Cypress.Commands.add('getCurrentState', { prevSubject: true }, getCurrentState);
