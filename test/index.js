var test = require('tap').test

var setup = require('./utils/setup')

test('App Tracker', function (t) {
  setup(t, function (error, api, server, debug) {
    if (error) {
      t.error(error)
      return t.end()
    }

    require('./connection-status-test')(t.test, api, server, debug)
    require('./smoke-test')(t.test, api, server, debug)
    require('./store-test')(t.test, api, server, debug)
    require('./walkthrough-test')(t.test, api, server, debug)

    t.end()
  })
})
