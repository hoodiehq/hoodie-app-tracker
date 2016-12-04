module.exports = logError

function logError (error) {
  console.log(error)

  throw error
}
