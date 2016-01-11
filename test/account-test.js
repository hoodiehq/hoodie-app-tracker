/* global describe, it, hoodie */
require('@gr2m/frontend-test-setup')

var expect = require('chai').expect

function toValue (result) {
  if (isError(result.value)) {
    var error = new Error(result.value.message)
    Object.keys(result.value).forEach(function (key) {
      error[key] = result.value[key]
    })
    throw error
  }

  return result.value
}

function isError (value) {
  return value && value.name && /error/i.test(value.name)
}

function logError (error) {
  console.log(error)

  throw error
}

describe('hoodie', function () {
  this.timeout(90000)

  it('account', function () {
    var username = 'user' + Math.random().toString(16).substr(2)
    var password = 'secret'
    var newUsername = username // username + 'new'
    var newPassword = 'secret' // 'secret2'
    var accountId

    return this.client.url('/')

    // sanity check
    .execute(function isSignedIn () {
      return hoodie.account.isSignedIn()
    }).then(toValue)
    .should.eventually.equal(false)

    // hoodie.account.id persists
    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      accountId = id
    })

    .url('/')

    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.equal(accountId)
    })

    // preparations for events testing
    .execute(function setEvents () {
      window.accountEvents = []

      ;[
        'signin',
        'signup',
        'signout',
        'changeusername',
        'changepassword',
        'passwordreset',
        'destroy',
        'unauthenticate',
        'reauthenticate'
      ].forEach(function (eventName) {
        hoodie.account.on(eventName, function () {
          window.accountEvents.push(eventName)
        })
      })
    })

    // signin to fail with invalid username
    .executeAsync(function signInWithInvalidCredentials (done) {
      return hoodie.account.signIn({
        username: 'foo',
        password: 'bar'
      })

      .then(done, done)
    }).then(toValue)
    .catch(function (/* error */) {
      // expect(error.name).to.equal('UnauthorizedError')
      // expect(error.mesagge).to.equal('Invalid credentials')
    })

    // signup resolves with account properties
    .executeAsync(function signUp (username, password, done) {
      hoodie.account.signUp({
        username: username,
        password: password
      })

      .then(done, done)
    }, username, password).then(toValue)
    .should.eventually.have.property('username', username)

    // signin resolves with account properties
    .executeAsync(function signIn (username, password, done) {
      hoodie.account.signIn({
        username: username,
        password: password
      })

      .then(done, done)
    }, username, password).then(toValue)
    .should.eventually.have.property('username', username)

    // hoodie.account.id does not change after sign up
    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.equal(accountId)
    })

    // sets username
    .execute(function username () {
      return hoodie.account.username
    }).then(toValue)
    .should.eventually.equal(username)

    // sets isSignedIn
    .execute(function isSignedIn () {
      return hoodie.account.isSignedIn()
    }).then(toValue)
    .should.eventually.equal(true)

    // // change password resolves with account poperties
    // .executeAsync(function changePassword (password, done) {
    //   hoodie.account.update({
    //     password: password
    //   })
    //
    //   .then(done, done)
    // }, newPassword).then(toValue)
    // .should.eventually.have.property('username', username)
    //
    // // change username resolves with account poperties
    // .executeAsync(function changeUsername (username, done) {
    //   hoodie.account.update({
    //     username: username
    //   })
    //
    //   .then(done, done)
    // }, newUsername).then(toValue)
    // .should.eventually.have.property('username', newUsername)
    //
    // // hoodie.account.username changed
    // .execute(function username () {
    //   return hoodie.account.username
    // }).then(toValue)
    // .should.eventually.equal(newUsername)

    // signout resolves with account properties
    .executeAsync(function signOut (username, done) {
      hoodie.account.signOut()

      .then(done, done)
    }, newUsername).then(toValue)
    .should.eventually.have.property('username', newUsername)

    // hoodie.account.id changes after sign out
    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.not.equal(accountId)
    })

    // hoodie.account.id gets set after sign in
    .executeAsync(function signIn (username, password, done) {
      hoodie.account.signIn({
        username: username,
        password: password
      })

      .then(function () {
        return hoodie.account.id
      })

      .then(done, done)
    }, newUsername, newPassword).then(toValue)
    .then(function (id) {
      expect(id).to.equal(accountId)
    })

    // destory resolves with account properties
    // depends on https://github.com/hoodiehq/hoodie-client-account/issues/53
    // .executeAsync(function signInAndDestroy (username, password, done) {
    //   return hoodie.account.destroy()
    //
    //   .then(done, done)
    // }, newUsername, newPassword).then(toValue)
    // .should.eventually.have.property('username', username)

    // hoodie.account.id changes after destroy
    // .execute(function getId () {
    //   return hoodie.account.id
    // }).then(toValue)
    // .then(function (id) {
    //   expect(id).to.not.equal(accountId)
    // })

    // check events
    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(4)
      expect(events[0]).to.equal('signup')
      expect(events[1]).to.equal('signin')
      expect(events[2]).to.equal('signout')
      expect(events[3]).to.equal('signin')

      // expect(events.length).to.equal(8)
      // expect(events[0]).to.equal('signup')
      // expect(events[1]).to.equal('signin')
      // expect(events[2]).to.equal('changepassword')
      // expect(events[3]).to.equal('changeusername')
      // expect(events[4]).to.equal('signout')
      // expect(events[5]).to.equal('signin')
      // expect(events[6]).to.equal('signout')
      // expect(events[7]).to.equal('destroy')
    })

    // simulate unauthenticated state
    .execute(function setInvalidSessionId () {
      var account = JSON.parse(window.localStorage.getItem('account'))
      account.session.id = 'invalidsession123'
      window.localStorage.setItem('account', JSON.stringify(account))
    })

    .url('/')

    .execute(function events () {
      window.accountEvents = []

      ;[
        'signin',
        'signup',
        'signout',
        'changeusername',
        'changepassword',
        'passwordreset',
        'destroy',
        'unauthenticate',
        'reauthenticate'
      ].forEach(function (eventName) {
        hoodie.account.on(eventName, function () {
          window.accountEvents.push(eventName)
        })
      })
    })

    // fetch triggeres unauthenticate event
    .executeAsync(function fetch (done) {
      return hoodie.account.fetch()

      .then(done, done)
    }).then(toValue)
    .catch(function (/* error */) {
      // https://github.com/hoodiehq/hoodie-client-account/issues/54
      // expect(error.name).to.equal('UnauthenticatedError')
      // expect(error.mesagge).to.equal('Invalid session')
    })

    .execute(function getEvents () {
      return window.accountEvents
    })
    .then(function (events) {
      // https://github.com/hoodiehq/hoodie-client-account/issues/54
      // expect(events.length).to.equal(1)
      // expect(events[1]).to.equal('unauthenticate')
    })

    // persists unauthenticated state
    .url('/')

    // https://github.com/hoodiehq/hoodie-client-account/issues/56
    // .execute(function getIsUnauthenticated () {
    //   return hoodie.account.isUnauthenticated()
    // }).then(toValue)
    // .should.eventually.equal(true)

    // signin emits reauthenticate event
    .execute(function setEvents () {
      window.accountEvents = []

      ;[
        'signin',
        'signup',
        'signout',
        'changeusername',
        'changepassword',
        'passwordreset',
        'destroy',
        'unauthenticate',
        'reauthenticate'
      ].forEach(function (eventName) {
        hoodie.account.on(eventName, function () {
          window.accountEvents.push(eventName)
        })
      })
    })

    .executeAsync(function (username, password, done) {
      hoodie.account.signIn({
        username: username,
        password: password
      })

      .then(done, done)
    }, newUsername, newPassword)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)

    .then(function (events) {
      expect(events.length).to.equal(1)
      // https://github.com/hoodiehq/hoodie-client-account/issues/57
      // expect(events[1]).to.equal('reauthenticate')
    })

    .catch(logError)

    // cleanup
    .localStorage('DELETE')
  })
})
