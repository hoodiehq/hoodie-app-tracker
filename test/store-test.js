// DAFUQ?
// hoodie.store.add({ foo: 'bar' })
//
// .then(function () {
//   return hoodie.store.findAll()
// })
//
// .then(function (docs) {
//   console.assert(docs.length === 1)
// })
//
// .then(function () {
//   return hoodie.account.signUp({
//     username: 'storetest',
//     password: 'secret'
//   })
// })
//
// .then(function () {
//   return window.hoodie.account.signIn({
//     username: 'storetest',
//     password: 'secret'
//   })
// })

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
      api.browser.executeAsync(function (done) {
        window.hoodie.account.destroy()

        .then(done, done)
      }).url('about:blank').then(function () {
        done()
      }).catch(function (error) {
        done(error)
      })
    })

    // https://github.com/hoodiehq/hoodie-client/issues/44
    t.test('.findAll() objects after signin', function (tt) {
      tt.plan(4)

      api.browser

      .executeAsync(function (done) {
        window.hoodie.store.add({ foo: 'bar' }).then(done, done)
      })

      .executeAsync(function (done) {
        window.hoodie.store.findAll().then(done, done)
      }).then(toValue)

      .then(function (docs) {
        tt.is(docs.length, 1, 'finds 1 doc after creating one')
        tt.is(docs[0].foo, 'bar', 'doc has expected properties')
      })

      .executeAsync(function (done) {
        window.hoodie.account.signUp({
          username: 'storetest',
          password: 'secret'
        }).then(function () {
          return window.hoodie.account.signIn({
            username: 'storetest',
            password: 'secret'
          })
        }).then(done, done)
      })

      .executeAsync(function (done) {
        window.hoodie.account.signOut().then(done, done)
      })

      .executeAsync(function (done) {
        window.hoodie.store.findAll().then(done, done)
      }).then(toValue)

      .then(function (docs) {
        tt.is(docs.length, 0, 'does not find created doc after signout')
      })

      .executeAsync(function (done) {
        window.hoodie.account.signIn({
          username: 'storetest',
          password: 'secret'
        }).then(done, done)
      })

      .waitUntil(function () {
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
