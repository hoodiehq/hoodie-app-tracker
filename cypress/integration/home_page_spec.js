module.exports = startHoodie

var hoodieCli = require('hoodie/cli')

function startHoodie (callback) {
  process.env.hoodie_inMemory = true
  hoodieCli(callback)
}

describe('The Home Page', function () {
  it('successfully loads', function () {
    cy.visit('/')
  })
})
