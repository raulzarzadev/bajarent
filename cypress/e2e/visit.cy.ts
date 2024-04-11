describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:19006/')

    // 2. Llena los campos del formulario
    cy.get('input[placeholder="Nombre"]').type('Nombre de prueba')
    cy.get('input[placeholder="Email"]').type('prueba@example.com')
    cy.get('input[placeholder="Password"]').type('passwordseguro')

    // 3. Haz clic en el botón de enviar
    cy.get('button').contains('Ingresar').click()
  })
})
