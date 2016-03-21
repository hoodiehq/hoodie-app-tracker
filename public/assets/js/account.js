var originalDocumentTitle = document.title
var locationHash = window.location.hash.replace('#', '')

/**
 * Find all elements with a data-show attribute and apply a click handler
 * in which we check if an element with a data-action attribute was clicked.
 * If yes, then set the data-show attribute of the container element to what
 * is in the data-action of the clicked attribute (after the show- prefix)
 */
;[].forEach.call(document.querySelectorAll('[data-show]'), function (el) {
  el.addEventListener('click', function (event) {
    var action = event.target.dataset.action
    var $formsContainer = event.currentTarget

    if (!action) {
      return
    }

    event.preventDefault()
    var showTarget = action.substr('show-'.length)
    $formsContainer.dataset.show = showTarget
    setHashState(showTarget)
  })
  if (locationHash) {
    el.dataset.show = locationHash
    setHashState(locationHash)
  }
})

/**
 * Handle signup form submit
 */
document.querySelector('form.signup').addEventListener('submit', function (event) {
  event.preventDefault()

  var email = this.querySelector('[name=email]').value
  var password = this.querySelector('[name=password]').value

  hoodie.account.signUp({
    username: email,
    password: password
  })

  .then(function () {
    return hoodie.account.signIn({
      username: email,
      password: password
    })
  })

  .then(setHashState)

  .catch(handleError)
})

/**
 * Handle signin form submit
 */
document.querySelector('form.signin').addEventListener('submit', function (event) {
  event.preventDefault()

  var email = this.querySelector('[name=email]').value
  var password = this.querySelector('[name=password]').value

  hoodie.account.signIn({
    username: email,
    password: password
  })

  .then(setHashState)

  .catch(handleError)
})

/**
 * Handle change email form submit
 */
document.querySelector('form.change-email').addEventListener('submit', function (event) {
  event.preventDefault()

  var email = this.querySelector('[name=email]').value

  hoodie.account.update({
    username: email
  })

  .catch(handleError)
})

/**
 * Handle password reset form submit
 */
document.querySelector('form.password-reset').addEventListener('submit', function (event) {
  event.preventDefault()

  var email = this.querySelector('[name=email]').value

  hoodie.account.request({
    type: 'passwordreset',
    username: email
  })

  .then(function () {
    alert('Email sent to ' + email)
    document.querySelector('[data-show="password-reset"]').dataset.show = 'signin'
    setHashState('signin')
  })

  .catch(handleError)
})

/**
 * Handle change password form submit
 */
document.querySelector('form.change-password').addEventListener('submit', function (event) {
  event.preventDefault()

  var password = this.querySelector('[name=password]').value

  hoodie.account.update({
    password: password
  })

  .catch(handleError)
})

/**
 * When clicking on "change username" button, set the input to current username
 */
document.querySelector('[data-action="show-change-email"]').addEventListener('click', function (event) {
  event.preventDefault()
  document.querySelector('#input-change-email').value = hoodie.account.username
})

/**
 * When clicking on "forgot password?" link, preset the email input with what is
 * entered in the sign in username input.
 */
document.querySelector('[data-action="show-password-reset"]').addEventListener('click', function (event) {
  event.preventDefault()
  document.querySelector('#input-email-reset').value = document.querySelector('#input-signin-email').value
})

/**
 * handle signout click. This will trigger a "signout" event which is handled
 * in common.js
 */
document.querySelector('[data-action=signout]').addEventListener('click', function (event) {
  event.preventDefault()
  hoodie.account.signOut()

  .then(setHashState)
})

/**
 * handle account destroy click. This will also trigger a "signout" event which
 * is handled in common.js
 */
document.querySelector('[data-action="delete-account"]').addEventListener('click', function (event) {
  event.preventDefault()
  hoodie.account.destroy()
})

function handleError (error) {
  alert(error)
}

function setHashState (hash) {
  var url = window.location.origin + window.location.pathname
  var title = originalDocumentTitle
  if (typeof hash === 'string') {
    url += '#' + hash
    var formattedHash = hash
      .split('-')
      .map(function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      })
      .join(' ')
    title += ' | ' + formattedHash
  }
  document.title = title
  window.history.replaceState(null, null, url)
  window.announce(document.title + ': Page loaded', 'assertive')
}

/* global hoodie, alert */
