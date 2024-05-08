import userTest from '../fixtures/user-test.json'

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006')
    cy.get('#profileButton').click()
    cy.contains('Perfil')
    cy.contains('Ingresar con email')
    cy.get('input[placeholder="Nombre"]').type(userTest.name)
    cy.get('input[placeholder="Email"]').type(userTest.email)
    cy.get('input[placeholder="Password"]').type(userTest.password)
    cy.get('button').contains('Ingresar').click()
    cy.get('[data-testid="storeButton"]').should('exist')
  })
})
