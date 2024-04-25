describe('template spec', () => {
  it('passes', () => {
    // cy.visit('https://dev.bajarent.app')
    cy.visit('http://localhost:19006')
    // cy.contains('Carlos').click()
    cy.get('#profileButton').click()
    cy.contains('Selecciona una tienda').should('exist')
    cy.get(':nth-child(1) > [data-testid="storeButton"]').click()
  })
})
