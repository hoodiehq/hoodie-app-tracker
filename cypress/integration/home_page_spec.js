/* global describe, cy, beforeEach, context, it */
describe('Hoodie Tracker Home Page', function () {
    // setup these constants to match what Tracker does
  var ITEM_ONE = 'Low-Profile Dog'
  var ITEM_TWO = 'Docs Chicken'
  var ITEM_THREE = 'Blog Bear'
  var ITEM_FOUR = 'Development Beaver'

  beforeEach(function () {
    // By default Cypress will automatically
    // clear the Local Storage prior to each
    // test which ensures no items carry over
    // between tests.
    //
    // Go out and visit our local web server
    // before each test, which serves us the
    // Tracker App we want to test against
    //
    // We've set our baseUrl to be http://localhost:8888
    // which is automatically prepended to cy.visit
    //
    // https://on.cypress.io/api/visit
    cy.visit('/')
  })

  context('Visit home page', function () {
    it('should load index.html successfully', function () {
      cy.visit('/')
      cy.get('title').contains('Tracker')
      // clear items if in cache
      cy.get('.primary').click()
    })
  })

  context('When page is initially opened', function () {
    it('should focus on the item input field', function () {
      cy.focused().should('have.id', 'input-note')
    })
  })

  context('No Items', function () {
    it('should hide item table', function () {
     // We don't need to create
     // a gazillion helper functions which are difficult to
     // parse through. Instead we'll opt to use real selectors
     // so as to make our testing intentions as clear as possible.
     //
     // http://on.cypress.io/get
      cy.get('.placeholder')
      cy.get('td').contains('Nothing tracked yet, add something!')
      cy.get('.list').should('not.be.visible')
    })
  })

  context('Add items', function () {
    it('should allow me to add items', function () {
      // create 1st item
      cy.get('#input-note').type(ITEM_ONE)
      cy.get('#input-amount').type('1')
      cy.get("button[type='submit']").click()
      // make sure the 1st label contains the 1st item text
      cy.get('table td').eq(1).should('contain', '1')
      cy.get('table td').eq(2).should('contain', ITEM_ONE)

       // create 2nd item
      cy.get('#input-note').type(ITEM_TWO)
      cy.get('#input-amount').type('2')
      cy.get("button[type='submit']").click()
      // make sure the 2nd label contains the 2nd item text
      cy.get('table td').eq(5).should('contain', '2')
      cy.get('table td').eq(6).should('contain', ITEM_TWO)
    })

    it('should clear text input field when an item is added', function () {
      cy.get('#input-note').type(ITEM_ONE)
      cy.get('#input-amount').type('23')
      cy.get("button[type='submit']").click()
      cy.get('#input-note').should('have.text', '')
      cy.get('#input-amount').should('have.text', '')
    })

    it('should trim text input', function () {
       // this is an example of another custom command
       // since we repeat the item creation over and over
       // again. It's up to you to decide when to abstract
       // repetitive behavior and roll that up into a custom
       // command vs explicitly writing the code.
      cy.get('#input-note').type('    ' + ITEM_ONE + '    ')
      cy.get('#input-amount').type('5')
      cy.get("button[type='submit']").click()
       // we use as explicit assertion here about the text instead of
       // using 'contain' so we can specify the exact text of the element
       // does not have any whitespace around it
      cy.get('table td').eq(14).should('have.text', ITEM_ONE)
    })

    it('should show remove all button', function () {
      cy.get('#input-note').type(ITEM_ONE)
      cy.get('#input-amount').type('7')
      cy.get("button[type='submit']").click()
      cy.get('.primary').should('be.visible')
    })
  })

  context('Table of items', function () {
    it('should allow me to edit an item', function () {
      cy.get('#input-note').type(ITEM_ONE)
      cy.get('#input-amount').type('237')
      cy.get("button[type='submit']").click()
      cy.get('table td').eq(3).click()
      cy.get('table td input').eq(1).type(ITEM_THREE)
      cy.get('table td').eq(3).click()
      // explicitly assert about the text value
      cy.get('table td').eq(2).should('contain', ITEM_THREE)
    })

    it('should allow me to delete an item', function () {
      cy.get('#input-note').type(ITEM_FOUR)
      cy.get('#input-amount').type('21')
      cy.get("button[type='submit']").click()
      cy.get('table td').eq(4).click()
      // explicitly assert about the text value
      cy.get('table td').eq(2).should('contain', ITEM_TWO)
    })
  })
})
