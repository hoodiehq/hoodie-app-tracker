var $passwordResetButton = document.querySelector('.js-reset-password')
var $signinForm = document.querySelector('.js-signin-form')
var $signupForm = document.querySelector('.js-signup-form')
var $accountForms = document.querySelector('.js-account-forms')
var $signedinMessage = document.querySelector('.js-signedin-message')
var $signupButton = document.querySelector('.js-signup-btn')
var $signoutButton = document.querySelector('.js-signout-btn')
var $signinToggle = document.querySelector('.js-signin-toggle')
var $signupToggle = document.querySelector('.js-signup-toggle')

var $trackerForm = document.querySelector('.js-tracker-input')
var $trackerOutput = document.querySelector('.js-tracker-output')
var $trackerClearButton = document.querySelector('.js-tracker-clear')

var $editDeleteItem = document.querySelector('.js-edit-delete')

$passwordResetButton.addEventListener('click', function (event) {
  event.preventDefault()

  var email = prompt('Email', $signinForm.querySelector('[name=email]').value)

  if (!email) {
    return
  }

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

/**
 * If you submit a form it will emit a submit event.
 * This is better than listening for a click on the submit button for example.
 * It will catch you submitting via pressing 'enter' on a keyboard or something like 'Go' on a mobile keyboard.
 * More info on form accessibility: http://webaim.org/techniques/forms/
 **/
$trackerForm.addEventListener('submit', function (event) {
  /**
   * By default a form will submit your form data to the page itself,
   * this is useful if you're doing a traditional web app but we want to handle this in JavaScript instead.
   * if we're overriding this behaviour in JavaScript we need to grab the event
   * and prevent it from doing it's default behaviour.
   **/
  event.preventDefault()

  var amount = $trackerForm.querySelector('[name=amount]').value
  var note = $trackerForm.querySelector('[name=note]').value

  // Clear out out the values in the form ready for more input.
  $trackerForm.reset()

  hoodie.store.add({
    amount: amount,
    note: note
  })
})

$trackerClearButton.addEventListener('click', function (event) {
  hoodie.store.clear().then(function () {
    window.location.reload()
  })
})

function orderByCreatedAt (item1, item2) {
  return item1.createdAt > item2.createdAt ? 1 : -1
}

/**
 * With hoodie we're storing our data locally and it will stick around next time you reload.
 * This means each time the page loads we need to find any previous notes that we have stored.
 */
hoodie.store.findAll().then(function (notes) {
  notes.sort(orderByCreatedAt).forEach(addNote)
})

/**
 * Any newly added notes will emit the 'add' event
 * We can update the page with any new notes.
 */
hoodie.store.on('add', addNote)

function addNote (note) {
  var $tablePlaceholder = $trackerOutput.querySelector('.table-placeholder')
  // Remove initial placeholder content
  if ($tablePlaceholder) {
    $tablePlaceholder.remove()
  }
  if ($trackerClearButton.classList.contains('hide')) {
    $trackerClearButton.classList.remove('hide')
  }
  var row = document.createElement('tr')
  var amountTd = document.createElement('td')
  var noteTd = document.createElement('td')
  var editTd = document.createElement('td')
  var deleteTd = document.createElement('td')

  amountTd.textContent = note.amount
  noteTd.textContent = note.note
  editTd.innerHTML = '<a href="#" class="edit-item">Edit</a>'
  deleteTd.innerHTML = '<a href="#" class="delete-item">Delete</a>'

  row.setAttribute('id', 'item-' + note.id)
  row.appendChild(amountTd)
  row.appendChild(noteTd)
  row.appendChild(editTd)
  row.appendChild(deleteTd)

  $trackerOutput.appendChild(row)
}

$editDeleteItem.addEventListener('click', function (event) {
  event.preventDefault()

  var row = event.target.parentNode.parentNode
  var id = row.id.substr('item-'.length)
  var amount = row.firstChild.textContent
  var note = row.firstChild.nextSibling.textContent

  if (event.target.textContent == 'Delete') {
    row.remove();

    hoodie.store.remove({
      id: id
    })
  }

  if (event.target.textContent == 'Edit') {
    row.innerHTML = '<td><input type="number" name="amount" value="'+ amount +'" data-reset-value="'+ amount +'"></td><td><input type="text" name="note" value="'+ note +'" data-reset-value="'+ note +'"></td><td><a href="#" class="save-edit">Save</a></td><td><a href="#" class="cancel-edit">Cancel</a></td>'
  }

  if (event.target.textContent == 'Cancel') {
    amount = row.querySelector('input[name=amount]').dataset.resetValue
    note = row.querySelector('input[name=note]').dataset.resetValue
    row.innerHTML = '<td>' + amount + '</td><td>' + note + '</td><td><a href="#" class="edit-item">Edit</a></td><td><a href="#" class="delete-item">Delete</a></td>'
  }

  if (event.target.textContent == 'Save') {
    amount = row.querySelector('input[name=amount]').value
    note = row.querySelector('input[name=note]').value
    hoodie.store.update(id, {
      amount: amount,
      note: note
    })
    row.innerHTML = '<td>' + amount + '</td><td>' + note + '</td><td><a href="#" class="edit-item">Edit</a></td><td><a href="#" class="delete-item">Delete</a></td>'
  }
})

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
