export const testUser = {
  email: 'prueba@example.com',
  password: 'passwordseguro'
}
describe('visit', () => {
  // beforeEach(() => {
  //   cy.visit('http://localhost:19006/')
  // })
  it('should visit the app', () => {
    cy.visit('http://localhost:19006/')
  })
  it('should be visible to login', () => {
    cy.visit('http://localhost:19006/')

    cy.get('button').contains('Ingresar').should('be.visible')
  })
  it('should not be able to logout', () => {
    cy.visit('http://localhost:19006/')

    cy.get('button').contains('Cerrar sesión').should('not.exist')
  })
})

describe('login and logout', () => {
  it('should be able to login and log out', () => {
    cy.visit('http://localhost:19006/')
    cy.get('input[placeholder="Email"]').type(testUser.email)
    cy.get('input[placeholder="Password"]').type(testUser.password)
    cy.get('button').contains('Ingresar').click()
    cy.get('button').contains('Cerrar sesión').click()
  })
})
