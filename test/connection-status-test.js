module.exports = connectionStatusTest

var toValue = require('./utils/to-value')

function patchXHRToFail () {
  (function (open) {
    window.XMLHttpRequest.prototype.origOpen = open
    window.XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
      console.log('PATCHED HML!')
      open.call(this, method, 'http://fail', async, user, pass)
    }
  })(window.XMLHttpRequest.prototype.open)
}

function connectionStatusTest (test, api, server, debug) {
  test('hoodie.connectionStatus', function (t) {
    t.beforeEach(function (done) {
      api.browser

      .waitUntil(function () {
        return this.url(server.info.uri)
          .execute(function checkIfHoodieExists () {
            try {
              return window.hoodie.connectionStatus.hasOwnProperty('ok')
            } catch (e) {
              return false
            }
          }).then(toValue)
      }, 10000, 'waiting for hoodie is ready')

      // keep track of events for tests
      .execute(function setEvents () {
        window.events = [];
        ['disconnect', 'reconnect'].forEach(function (eventName) {
          window.hoodie.connectionStatus.on(eventName, function () {
            window.events.push(eventName)
          })
        })
        return 'ok'
      }).then(toValue)
      .then(function () {
        done()
      })
      .catch(done)
    })

    t.test('.check() when request succeeds', function (tt) {
      api.browser

      // window.hoodie.checkConnection to resolve
      .executeAsync(function checkConnection1 (done) {
        try {
          window.hoodie.connectionStatus.check().then(done, done)
        } catch (error) {
          done(error)
        }
      }).then(toValue).then(function (result) {
        tt.is(result, null)
        tt.end()
      }).catch(t.error)
    })

    t.test('.ok returns true', function (tt) {
      api.browser.execute(function getConnectionStatus1 () {
        return window.hoodie.connectionStatus.ok
      }).then(toValue).then(function (result) {
        tt.is(result, true)
        tt.end()
      }).catch(t.error)
    })

    t.test('.check() when request errors', function (tt) {
      api.browser

      .pause(3000)

      .execute(patchXHRToFail)

      .executeAsync(function checkConnection2 (done) {
        return window.hoodie.connectionStatus.check()

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
      }).then(toValue)

      .then(function (events) {
        tt.is(events.length, 1)
        tt.is(events[0], 'disconnect')
        tt.end()
      }).catch(t.error)
    })

    t.test('.ok after .check() failed', function (tt) {
      api.browser

      .execute(function getConnectionStatus2 () {
        return window.hoodie.connectionStatus.ok
      }).then(toValue).then(function (result) {
        tt.is(result, false)
        tt.end()
      }).catch(tt.error)
    })

    t.test('.check() when request succeeds after it failed before', function (tt) {
      api.browser.executeAsync(function checkConnection3 (done) {
        return window.hoodie.connectionStatus.check().then(function () {
          // timeout to avoid racing condition:
          // https://github.com/hoodiehq/hoodie-app-tracker/issues/32
          setTimeout(function () {
            done(window.events)
          }, 0)
        }).catch(function () {
          done(new Error('.check() should resolve'))
        })
      }).then(toValue).then(function (events) {
        tt.is(events.length, 1)
        tt.is(events[0], 'reconnect')
        tt.end()
      }).catch(tt.error)
    })

    t.test('.ok after reconnect', function (tt) {
      api.browser.execute(function getConnectionStatus3 () {
        return window.hoodie.connectionStatus.ok
      }).then(toValue).then(function (result) {
        tt.is(result, true)
        tt.end()
      }).catch(tt.error)
    })

    t.end()
  })
}
