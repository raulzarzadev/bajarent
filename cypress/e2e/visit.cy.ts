describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006/')
    cy.get('[testID="form-sign-up"]').within(() => {
      cy.get('input[name="name"]').type('John Doe')
      cy.get('input[name="username"]').type('johndoe')
      cy.get('input[name="password"]').type('password123')
    })
  })
})
