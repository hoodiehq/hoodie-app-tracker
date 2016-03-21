!(function (global, document) {
  var announceTimer
  var $announcer = document.getElementById('a11y-announcer')
  var announce = function (message, tone) {
    tone = tone || 'polite'
    $announcer.setAttribute('aria-live', 'off')
    $announcer.innerHTML = ''
    clearTimeout(announceTimer)
    announceTimer = setTimeout(function () {
      $announcer.setAttribute('aria-live', tone)
      $announcer.innerHTML = message
    }, 500)
  }
  global.announce = announce
})(window, document)
