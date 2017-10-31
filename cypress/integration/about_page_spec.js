describe('Hoodie Tracker About Page', function(){
 context('About page', function(){

    it('should allow me to visit About page', function(){
      cy.visit('/')
      cy.get("a[href='about.html']").click()
      cy.get('title').contains('Tracker | About')
    })
  })
})
