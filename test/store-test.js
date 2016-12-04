module.exports = storeTest
var toValue = require('./utils/to-value')

function storeTest (test, api, server, debug) {
  test('hoodie.store', function (t) {
    t.beforeEach(function (done) {
      api.browser.url(server.info.uri).then(function () {
        done()
      })
    })

    t.afterEach(function (done) {
      api.browser.execute(function () {
        window.localStorage.clear()
      }).url('about:blank').then(function () {
        done()
      }).catch(function (error) {
        done(error)
      })
    })

    t.test('.hasLocalChanges() cleared after sign up', function (tt) {
      api.browser.executeAsync(function (done) {
        window.hoodie.store.removeAll().then(function () {
          return window.hoodie.store.hasLocalChanges()
        }).then(done, done)
      }).then(toValue).then(function (hasChanges) {
        tt.is(hasChanges, false)
      }).executeAsync(function (done) {
        window.hoodie.store.add({ foo: 'bar' }).then(function () {
          return window.hoodie.store.hasLocalChanges()
        }).then(done, done)
      }).then(toValue).then(function (hasChanges) {
        tt.is(hasChanges, true)
      })

      // sanity check
      .execute(function getUsername () {
        return window.hoodie.account.username
      }).then(toValue).then(function (username) {
        tt.is(username, null)
      }).executeAsync(function (done) {
        window.hoodie.account.signUp({
          username: 'storetest',
          password: 'secret'
        }).then(function () {
          return window.hoodie.account.signIn({
            username: 'storetest',
            password: 'secret'
          })
        }).then(done, done)
      }).waitUntil(function () {
        return this.execute(function storeHasNoLocalChanges (done) {
          return window.hoodie.store.hasLocalChanges() === false
        }).then(toValue)
      }, 10000, 'waiting for "hoodie.store.hasLocalChanges() === false"').then(function () {
        tt.end()
      }).catch(tt.error)
    })

    // https://github.com/hoodiehq/hoodie-client/issues/44
    t.test('.findAll() objects after signin', function (tt) {
      tt.plan(1)

      api.browser.executeAsync(function (done) {
        window.hoodie.account.signIn({
          username: 'storetest',
          password: 'secret'
        }).then(done, done)
      }).waitUntil(function () {
        return this.executeAsync(function findsObjects (done) {
          window.hoodie.store.findAll().then(done, done)
        }).then(toValue).then(function (objects) {
          return objects.length === 1
        })
      }, 10000).then(function () {
        tt.pass('finds objects after signin')
      }).catch(tt.error)
    })

    t.end()
  })
}
