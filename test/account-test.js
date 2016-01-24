/* global describe, beforeEach, it, hoodie */
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

describe('hoodie.account', function () {
  this.timeout(90000)

  var username = 'user' + Math.random().toString(16).substr(2)
  var password = 'secret'
  var newUsername = username // username + 'new'
  var newPassword = 'secret' // 'secret2'
  var accountId

  beforeEach(function () {
    return this.client.url('/')

    // keep track of events for tests
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
  })

  it('.isSignedIn returns false', function () {
    return this.client

    // sanity check
    .execute(function isSignedIn () {
      return hoodie.account.isSignedIn()
    }).then(toValue)
    .should.eventually.equal(false)
  })

  it('.id persist page reload', function () {
    return this.client

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
  })

  it.skip('.signIn(options) with invalid credentials\n      hoodiehq/hoodie-server-account#52', function () {
    return this.client

    .executeAsync(function signInWithInvalidCredentials (done) {
      return hoodie.account.signIn({
        username: 'foo',
        password: 'bar'
      })

      .then(done, done)
    }).then(toValue)
    .catch(function (error) {
      expect(error.name).to.equal('UnauthorizedError')
      expect(error.message).to.equal('Invalid credentials')
    })
  })

  it('signUp(options)', function () {
    return this.client

    .executeAsync(function signUp (username, password, done) {
      hoodie.account.signUp({
        username: username,
        password: password
      })

      .then(done, done)
    }, username, password).then(toValue)
    .should.eventually.have.property('username', username)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('signup')
    })
  })

  it('signIn(options)', function () {
    return this.client

    .executeAsync(function signIn (username, password, done) {
      hoodie.account.signIn({
        username: username,
        password: password
      })

      .then(done, done)
    }, username, password).then(toValue)
    .should.eventually.have.property('username', username)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('signin')
    })
  })

  it('.id does not change after signUp & signIn', function () {
    return this.client

    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.equal(accountId)
    })
  })

  it('.username set after signIn', function () {
    return this.client

    // sets username
    .execute(function username () {
      return hoodie.account.username
    }).then(toValue)
    .should.eventually.equal(username)
  })

  it('.isSignedIn() returns true after signIn', function () {
    return this.client

    // sets isSignedIn
    .execute(function isSignedIn () {
      return hoodie.account.isSignedIn()
    }).then(toValue)
    .should.eventually.equal(true)
  })

  it.skip('.update({password: newPassword}) resolves with account properties\n      hoodiehq/hoodie-client-account#52', function () {
    return this.client

    .executeAsync(function changePassword (newPassword, done) {
      hoodie.account.update({
        password: newPassword
      })
      .then(done, done)
    }, newPassword).then(toValue)
    .should.eventually.have.property('username', username)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('update')
    })
  })

  it.skip('.update({username: newUsername}) resolves with account properties\n      hoodiehq/hoodie-client-account#52', function () {
    return this.client

    .executeAsync(function changePassword (newUsername, done) {
      hoodie.account.update({
        username: newUsername
      })
      .then(done, done)
    }, newUsername).then(toValue)
    .should.eventually.have.property('username', username)
  })

  it('.signOut() resolves with account properties', function () {
    return this.client

    // sets isSignedIn
    .executeAsync(function signOut (username, done) {
      hoodie.account.signOut()

      .then(done, done)
    }, newUsername).then(toValue)
    .should.eventually.have.property('username', newUsername)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('signout')
    })
  })

  it('.id changes after .signOut()', function () {
    return this.client

    // hoodie.account.id changes after sign out
    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.not.equal(accountId)
    })
  })

  it('.id gets set after signIn', function () {
    return this.client

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
  })

  it.skip('.destroy() resolves with account properties\n      hoodiehq/hoodie-client-account#53', function () {
    return this.client

    .executeAsync(function destroy (username, password, done) {
      return hoodie.account.destroy()

      .then(done, done)
    }, newUsername, newPassword).then(toValue)
    .should.eventually.have.property('username', username)

    .execute(function getEvents () {
      return window.accountEvents
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('destroy')
    })
  })

  // depends on test above
  it.skip('.id changes after .destroy()\n      hoodiehq/hoodie-client-account#53', function () {
    return this.client

    .execute(function getId () {
      return hoodie.account.id
    }).then(toValue)
    .then(function (id) {
      expect(id).to.not.equal(accountId)
    })
  })

  it.skip('.fetch with UnauthenticatedError\n      hoodiehq/hoodie-client-account#54', function () {
    return this.client

    .executeAsync(function signIn (username, password, done) {
      hoodie.account.signIn({
        username: username,
        password: password
      })

      .then(done, done)
    }, newUsername, newPassword).then(toValue)

    .executeAsync(function fetch (done) {
      return hoodie.account.fetch()

      .then(done, done)
    }).then(toValue)
    .catch(function (error) {
      expect(error.name).to.equal('UnauthenticatedError')
      expect(error.message).to.equal('Invalid session')
    })

    .execute(function getEvents () {
      return window.accountEvents
    })
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('unauthenticate')
    })
  })

  it.skip('.isUnauthenticated()\n      hoodiehq/hoodie-client-account#56', function () {
    return this.client

    .execute(function getIsUnauthenticated () {
      return hoodie.account.isUnauthenticated()
    }).then(toValue)
    .should.eventually.equal(true)
  })

  it.skip('.signIn() when unauthenticated\n      hoodiehq/hoodie-client-account#57', function () {
    return this.client

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
      expect(events[1]).to.equal('reauthenticate')
    })
  })
})
