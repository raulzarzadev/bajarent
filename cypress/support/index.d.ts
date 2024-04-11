declare namespace Cypress {
  interface Chainable {
    login({ email, password }): void
    logout(): void
  }
}
