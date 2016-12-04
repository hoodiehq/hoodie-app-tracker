module.exports = smokeTest

function smokeTest (test, api, server, debug) {
  test('landing page', function (t) {
    api.browser.url(server.info.uri).getTitle().then(function (title) {
      t.equal(title, 'Tracker', 'Title should be "Tracker"')
    }).catch(t.error).then(function () {
      t.end()
    })
  })
}
