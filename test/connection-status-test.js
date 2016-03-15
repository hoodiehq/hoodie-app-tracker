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

function patchXHRToFail () {
  (function (open) {
    window.XMLHttpRequest.prototype.origOpen = open
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      open.call(this, method, 'http://fail', async, user, pass)
    }
  })(window.XMLHttpRequest.prototype.open)
}

describe('hoodie.connectionStatus', function () {
  this.timeout(90000)

  beforeEach(function () {
    return this.client.url('/')

    // keep track of events for tests
    .execute(function setEvents () {
      window.events = []

      ;[
        'disconnect',
        'reconnect'
      ].forEach(function (eventName) {
        hoodie.connectionStatus.on(eventName, function () {
          window.events.push(eventName)
        })
      })
    })
  })

  it('.check() when request succeeds', function () {
    return this.client

    // hoodie.checkConnection to resolve
    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .then(done, done)
    }).then(toValue)
    .should.eventually.equal(null)
  })

  it('.ok returns true', function () {
    return this.client

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(true)
  })

  it('.check() when request errors', function () {
    return this.client

    .execute(patchXHRToFail)
    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .then(function () {
        done(new Error('request should fail'))
      })

      .catch(function () {
        // timeout to avoid racing condition:
        // https://github.com/hoodiehq/hoodie-app-tracker/issues/32
        setTimeout(function () {
          done(window.events)
        }, 0)
      })
    })
    .then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('disconnect')
    })
  })

  it('.ok after .check() failed', function () {
    return this.client

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(false)
  })

  it('.check() when request succeeds after it failed before', function () {
    return this.client

    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .then(function () {
        // timeout to avoid racing condition:
        // https://github.com/hoodiehq/hoodie-app-tracker/issues/32
        setTimeout(function () {
          done(window.events)
        }, 0)
      })

      .catch(function () {
        done(new Error('.check() should resolve'))
      })
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('reconnect')
    })
  })

  it('.ok after reconnect', function () {
    return this.client

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(true)
  })
})
