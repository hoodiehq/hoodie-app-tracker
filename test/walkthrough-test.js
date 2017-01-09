/* global hoodie */
module.exports = walktroughTest

var logError = require('./utils/log-error')
var toValue = require('./utils/to-value')

function walktroughTest (test, selsa, server, debug) {
  test('hoodie', function (t) {
    t.test('walkthrough', function (tt) {
      var username = 'user' + Math.random().toString(16).substr(2)

      selsa.browser.url(server.info.uri).executeAsync(function storeAdd (username, done) {
        return hoodie.store.add({
          foo: 'bar'
        }).then(done, done)
      }, username).then(toValue).then(function (result) {
        tt.is(result.foo, 'bar')
      }).executeAsync(function signUp (username, done) {
        return hoodie.account.signUp({
          username: username,
          password: 'secret'
        }).then(done, done)
      }, username).then(toValue).then(function (result) {
        tt.is(result.username, username)
      }).executeAsync(function signOut (username, done) {
        return hoodie.account.signIn({
          username: username,
          password: 'secret'
        }).then(done, done)
      }, username).then(toValue).then(function (result) {
        tt.is(result.username, username)
      }).executeAsync(function signOut (done) {
        return hoodie.account.signOut().then(done, done)
      }).then(toValue).then(function (result) {
        tt.is(result.username, username)
      }).executeAsync(function storeFindAll (done) {
        return hoodie.store.findAll().then(done, done)
      }).then(toValue).then(function (result) {
        tt.deepEqual(result, [])
      }).catch(logError).then(function () {
        tt.end()
      })

      // cleanup
      .localStorage('DELETE')
    })

    t.end()
  })
}
