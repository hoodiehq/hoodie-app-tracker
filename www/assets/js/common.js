function showSignedIn (username) {
  document.querySelector('.js-username').textContent = username
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
