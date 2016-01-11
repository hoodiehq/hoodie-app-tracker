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

function patchXHRToFail () {
  (function (open) {
    window.XMLHttpRequest.prototype.origOpen = open
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      open.call(this, method, 'http://fail', async, user, pass)
    }
  })(window.XMLHttpRequest.prototype.open)
}

function unpatchXHR () {
  window.XMLHttpRequest.prototype.open = window.XMLHttpRequest.prototype.origOpen
}

describe('hoodie', function () {
  this.timeout(90000)

  it('connectionStatus', function () {
    return this.client.url('/')

    // preparations for events testing
    .execute(function () {
      window.events = []
      hoodie.connectionStatus.on('disconnect', function () {
        window.events.push('disconnect')
      })
      hoodie.connectionStatus.on('reconnect', function () {
        window.events.push('reconnect')
      })
    })

    // hoodie.checkConnection to resolve
    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .then(done, done)
    }).then(toValue)
    .should.eventually.equal(null)

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(true)

    // when connectionStatus.check() fails, `disconnect` event should get triggered
    .execute(patchXHRToFail)
    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .catch(function () {
        done(window.events)
      })

      .then(function () {
        done(new Error('request should fail'))
      })
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal('disconnect')
    })

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(false)

    // when Hoodie Server can be reached again
    // - hoodie.connectionStatus.check() resolves
    // - 'reconnect' event to be triggered
    .execute(unpatchXHR)
    .executeAsync(function checkConnection (done) {
      return hoodie.connectionStatus.check()

      .then(function () {
        done(window.events)
      })
    }).then(toValue)
    .then(function (events) {
      expect(events.length).to.equal(2)
      expect(events[1]).to.equal('reconnect')
    })

    .execute(function getConnectionStatus () {
      return hoodie.connectionStatus.ok
    }).then(toValue)
    .should.eventually.equal(true)

    .catch(logError)
  })
})
