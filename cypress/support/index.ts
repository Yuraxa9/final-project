/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here if needed
    }
  }
}

// Import commands.js using ES2015 syntax:
import './commands'; 