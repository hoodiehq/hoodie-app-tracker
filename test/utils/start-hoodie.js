module.exports = startHoodie

var hoodieCli = require('hoodie/cli')

function startHoodie (callback) {
  process.env.hoodie_inMemory = true
  hoodieCli(callback)
}
