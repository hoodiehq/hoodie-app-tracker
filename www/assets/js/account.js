var $passwordResetButton = document.querySelector('.js-reset-toggle')
var $passwordReset = document.querySelector('.js-password-reset')
var $signinForm = document.querySelector('.js-signin-form')
var $signupForm = document.querySelector('.js-signup-form')
var $accountForms = document.querySelector('.js-account-forms')
var $signedinMessage = document.querySelector('.js-signedin-message')
var $signupButton = document.querySelector('.js-signup-btn')
var $signoutButton = document.querySelector('.js-signout-btn')
var $signinToggle = document.querySelector('.js-signin-toggle')
var $signupToggle = document.querySelector('.js-signup-toggle')
var $usernameToggle = document.querySelector('.js-username-toggle')
var $usernameForm = document.querySelector('.js-username-form')
var $passwordToggle = document.querySelector('.js-password-toggle')
var $passwordForm = document.querySelector('.js-password-form')
var $deleteToggle = document.querySelector('.js-delete-toggle')

$passwordResetButton.addEventListener('click', function (event) {
  event.preventDefault()

  $passwordReset.classList.remove('hide')
  document.querySelector('.js-account-login').classList.add('hide')

  var email = document.findElementById('email-reset').value

  hoodie.account.request({
    type: 'passwordreset',
    username: email
  })

  .then(function () {
    alert('done')
  })

  .catch(function (error) {
    alert(error)
  })
})

$signinForm.addEventListener('submit', function (event) {
  event.preventDefault()

  $signinForm.classList.toggle('show')

  var email = $signinForm.querySelector('[name=email]').value
  var password = $signinForm.querySelector('[name=password]').value

  hoodie.account.signIn({
    username: email,
    password: password
  })

  .catch(function (error) {
    alert(error)
  })
})

$signinToggle.addEventListener('click', function (event) {
  event.preventDefault()

  $accountForms.setAttribute('data-show','signin')
})

$signupToggle.addEventListener('click', function (event) {
  event.preventDefault()

  $accountForms.setAttribute('data-show','signup')
})

$signupButton.addEventListener('click', function (event) {
  event.preventDefault()

  var email = $signupForm.querySelector('[name=email]').value
  var password = $signupForm.querySelector('[name=password]').value

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

  .catch(function (error) {
    alert(error)
  })
})

$signoutButton.addEventListener('click', function (event) {
  event.preventDefault()

  hoodie.account.signOut()
})

$usernameToggle.addEventListener('click', function (event) {
  event.preventDefault()

  $usernameForm.classList.remove('hide')
  document.querySelector('.js-settings-options').classList.add('hide')
})

$usernameForm.addEventListener('submit', function (event) {
  event.preventDefault()

  email = $usernameForm.querySelector('[name=email]').value

  hoodie.account.update({
    username: email
  })
})

$passwordToggle.addEventListener('click', function (event) {
  event.preventDefault()

  $passwordForm.classList.remove('hide')
  document.querySelector('.js-settings-options').classList.add('hide')
})

$deleteToggle.addEventListener('click', function (event) {
  event.preventDefault()

  document.querySelector('.js-delete-account').classList.remove('hide')
  document.querySelector('.js-settings-options').classList.add('hide')
})

function showSignedIn (username) {
  document.querySelector('.js-username').textContent = username
  document.getElementById('email').value = username

  document.body.setAttribute('data-account-state', 'signed-in')
}

function hideSignedIn () {
  document.body.setAttribute('data-account-state', 'signed-out')
}

hoodie.account.on('signin', function (account) {
  $signinForm.reset()
  showSignedIn(account.username)
})

hoodie.account.on('signout', hideSignedIn)
if (hoodie.account.isSignedIn()) {
  showSignedIn(hoodie.account.username)
} else {
  hideSignedIn()
}
