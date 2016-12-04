module.exports = setup

var selsa = require('selsa')
var debug = require('debug')('test')

var startHoodie = require('./start-hoodie')

function setup (t, callback) {
  var self = this

  selsa({}, function (error, api) {
    t.tearDown(function () {
      if (!self.server) {
        debug('server not running, stopping selsa')
        return api.tearDown(t.passing(), function (error) {
          if (error) {
            return debug(error)
          }

          debug('selsa stopped')
        })
      }

      if (self.server) {
        debug('stopping server')
        self.server.stop({ timeout: 100 }, function () {
          debug('server stopped, stopping selsa')

          api.tearDown(t.passing(), function (error) {
            if (error) {
              return debug(error)
            }

            debug('selsa stopped')
          })
        })
      }
    })

    t.error(error)

    if (error) {
      return callback(error)
    }

    startHoodie(function (error, server) {
      if (error) {
        return callback(error)
      }

      self.server = server
      debug('started server at ' + server.info.uri)

      callback(null, api, server, debug)
    })
  })
}
