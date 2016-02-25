var $addItemForm = document.querySelector('form.add-item')
var $itemsList = document.querySelector('.items .list')
var $clearButton = document.querySelector('[data-action="clear"]')

/**
 * With hoodie we're storing our data locally and it will stick around next time you reload.
 * This means each time the page loads we need to find any previous notes that we have stored.
 */
function loadAndRenderItems () {
  hoodie.store.findAll().then(render)
}

/* render items initially on page load */
loadAndRenderItems()

/**
 * Anytime there is a data change we reload and render the list of items
 */
hoodie.store.on('change', loadAndRenderItems)

$clearButton.addEventListener('click', function () {
  hoodie.store.removeAll()
})

/**
 * If you submit a form it will emit a submit event.
 * This is better than listening for a click on the submit button for example.
 * It will catch you submitting via pressing 'enter' on a keyboard or something like 'Go' on a mobile keyboard.
 * More info on form accessibility: http://webaim.org/techniques/forms/
 **/
$addItemForm.addEventListener('submit', function (event) {
  /**
   * By default a form will submit your form data to the page itself,
   * this is useful if you're doing a traditional web app but we want to handle this in JavaScript instead.
   * if we're overriding this behaviour in JavaScript we need to grab the event
   * and prevent it from doing it's default behaviour.
   **/
  event.preventDefault()

  // Get values from inputs, then clear the form
  var amount = $addItemForm.querySelector('[name=amount]').value
  var note = $addItemForm.querySelector('[name=note]').value
  $addItemForm.reset()

  hoodie.store.add({
    amount: amount,
    note: note
  })
})

/**
 * As items are dynamically added an removed, we cannot add event listeners
 * to the buttons. Instead, we register a click event on the items table and
 * then check if one of the buttons was clicked.
 * See: https://davidwalsh.name/event-delegate
 */
$itemsList.addEventListener('click', function (event) {
  event.preventDefault()

  var action = event.target.dataset.action
  if (!action) {
    return
  }

  var row = event.target.parentNode.parentNode
  var id = row.dataset.id
  var amount = row.firstChild.textContent
  var note = row.firstChild.nextSibling.textContent

  switch (action) {
    case 'edit':
      row.innerHTML = '<td><input type="number" name="amount" value="' + amount + '" data-reset-value="' + amount + '"></td>' +
                      '<td><input type="text" name="note" value="' + note + '" data-reset-value="' + note + '"></td>' +
                      '<td><a href="#" data-action="update">Save</a></td><td><a href="#" data-action="cancel">Cancel</a></td>'
      break
    case 'cancel':
      loadAndRenderItems()
      break

    case 'remove':
      hoodie.store.remove({
        id: id
      })
      break
    case 'update':
      amount = row.querySelector('input[name=amount]').value
      note = row.querySelector('input[name=note]').value
      hoodie.store.update(id, {
        amount: amount,
        note: note
      })
  }
})

function render (items) {
  if (items.length === 0) {
    document.body.dataset.storeState = 'empty'
    return
  }

  document.body.dataset.storeState = 'not-empty'
  $itemsList.innerHTML = items
    .sort(orderByCreatedAt)
    .map(function (item) {
      return '<tr data-id="' + item.id + '">' +
             '<td>' + item.amount + '</td>' +
             '<td>' + item.note + '</td>' +
             '<td><a href="#" data-action="edit">Edit</a></td>' +
             '<td><a href="#" data-action="remove">Delete</a></td>' +
             '</tr>'
    }).join('')
}
function orderByCreatedAt (item1, item2) {
  return item1.createdAt < item2.createdAt ? 1 : -1
}

/* global hoodie */
