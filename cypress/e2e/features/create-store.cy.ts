import { testUser } from '../visit.cy'

const storeTest = {
  name: 'Mi tienda de prueba',
  description: 'Esta es una tienda de prueba',
  nameEdited: 'Tienda editada'
}
describe('login and create a store', () => {
  it('open sesion', () => {
    cy.visit('http://localhost:19006/')
    cy.get('input[placeholder="Email"]').type(testUser.email)
    cy.get('input[placeholder="Password"]').type(testUser.password)
    cy.get('button').contains('Ingresar').click()
    cy.get('button').contains('Cerrar sesión').should('be.visible')
  })

  it.only('should be able to create a store', () => {
    cy.visit('http://localhost:19006/')
    cy.get('button').contains('Crear tienda').click()
    // cy.get('input[placeholder="Nombre"]').type(storeTest.name)
    // cy.scrollTo('bottom')
    // cy.wait(2000)

    // cy.get('button').contains('Guardar').click()
    // const guardarButton = cy.get('button').contains('Guardar')
    // guardarButton.click()
    // cy.wait(2000)
  })

  // it('should be able visit store ', () => {
  //   cy.visit('http://localhost:19006/')
  //   cy.get('div').contains(storeTest.name).click()
  //   cy.wait(1000)

  //   cy.get('#storeButton').should('be.visible').click()

  //   cy.wait(1000)

  //   cy.get('[role="tab"]').should('be.visible')
  // })

  // it('should be able edit store ', () => {
  //   cy.visit('http://localhost:19006/')
  //   cy.get('div').contains(storeTest.name).click()
  //   cy.wait(1000)

  //   cy.get('#storeButton').should('be.visible').click()

  //   cy.wait(1000)

  //   cy.get('[role="tab"]').contains('Tienda').click()
  //   cy.get('[role="tab"]').contains('Config').click()
  //   cy.get('#editStore').should('be.visible').click()
  //   cy.get('input[placeholder="Nombre"]').clear().type(storeTest.nameEdited)
  //   cy.scrollTo('bottom')
  //   cy.get('button').contains('Guardar').click()
  //   cy.wait(500)

  //   cy.get('div').contains(storeTest.nameEdited).should('be.visible')
  // })
  // it('should be able delete store ', () => {
  //   cy.visit('http://localhost:19006/')
  //   cy.get('div').contains(storeTest.nameEdited).click()
  //   cy.wait(1000)

  //   cy.get('#storeButton').should('be.visible').click()

  //   cy.wait(1000)

  //   cy.get('[role="tab"]').contains('Tienda').click()
  //   cy.get('[role="tab"]').contains('Config').click()
  //   cy.get('#editStore').should('be.visible').click()
  //   cy.get('input[placeholder="Nombre"]').clear().type(storeTest.nameEdited)
  //   cy.scrollTo('bottom')
  //   cy.get('button').contains('Eliminar').click()
  //   cy.get('#confirmButton').should('be.visible').click()
  //   cy.wait(1000)
  //   //cy.wait(500)
  //   cy.get('div').contains(storeTest.nameEdited).should('not.exist')
  // })
  // it('close sesion', () => {
  //   cy.visit('http://localhost:19006/')
  //   cy.wait(1000)
  //   cy.get('#profileButton').should('be.visible').click()
  //   cy.get('button').contains('Cerrar sesión').click()
  // })
})
