/* global describe, cy, context, it */
describe('Hoodie Tracker Account Page', function () {
  context('Account page', function () {
    it('should allow me visit Account page', function () {
      cy.visit('/')
      cy.get("a[href='account.html']").click()
      cy.get('title').contains('Tracker | Account')
    })

    it('should allow me to create an account', function () {
      cy.get('.btn').click()
      cy.get('#input-signup-email').type('example@example')
      cy.get('#input-signup-password').type('password')
      cy.get('#signup').click()
    })

    it('should sign me in when account is created', function () {
      cy.get("span[data-value='username']").should('have.text', 'example')
    })

    it('should allow me to delete account', function () {
      cy.get("button[data-action='show-delete-account']").click()
      cy.get("button[data-action='delete-account']").click()
      cy.get("span[data-hide-if='signed-in']").should('be.visible')
    })

    it.skip('should allow me to sign out', function () {
      cy.get("a[href='account.html']").click()
      cy.get('.btn').click()
      cy.get('#input-signup-email').type('example@example')
      cy.get('#input-signup-password').type('password')
      cy.get('#signup').click()
      cy.get('.small').click()
      cy.get("span[data-hide-if='signed-in']").should('be.visible')
    })
  })
})
