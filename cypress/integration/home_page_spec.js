
describe('TodoMVC - Hoodie', function(){

  // setup these constants to match what TodoMVC does
  var TODO_ITEM_ONE   = 'buy some cheese'
  var TODO_ITEM_TWO   = 'feed the cat'
  var TODO_ITEM_THREE = 'book a doctors appointment'

  beforeEach(function(){
    // By default Cypress will automatically
    // clear the Local Storage prior to each
    // test which ensures no todos carry over
    // between tests.
    //
    // Go out and visit our local web server
    // before each test, which serves us the
    // TodoMVC App we want to test against
    //
    // We've set our baseUrl to be http://localhost:8888
    // which is automatically prepended to cy.visit
    //
    // https://on.cypress.io/api/visit
    cy.visit("/")
  })

  context('When page is initially opened', function(){
    it('should focus on the todo input field', function(){
      // get the currently focused element and assert
      // that it has class='new-todo'
      //
      // http://on.cypress.io/focused
      cy.focused().should('have.id', 'input-note')
    })
})

context('The Home Page', function () {
  it('successfully loads', function () {
    cy.visit('/')
   cy.get('title').contains('Tracker')
  })
})

})
