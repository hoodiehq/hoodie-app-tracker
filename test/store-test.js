/* global describe, beforeEach, afterEach, it, hoodie */
require('@gr2m/frontend-test-setup')

var expect = require('chai').expect

function toValue (result) {
  if (isError(result.value)) {
    var error = new Error(result.value.message)
    Object.keys(result.value).forEach(function (key) {
      error[key] = result.value[key]
    })

    throw error
  }

  return result.value
}

function isError (value) {
  return value && value.error === true
}

describe('hoodie.store', function () {
  this.timeout(90000)

  beforeEach(function () {
    return this.client.url('/')
  })

  afterEach(function () {
    return this.client.execute(function () {
      window.localStorage.clear()
    })
  })

  it('.hasLocalChanges() cleared after sign up', function () {
    return this.client

    .executeAsync(function (done) {
      hoodie.store.removeAll()

      .then(function () {
        return hoodie.store.hasLocalChanges()
      })

      .then(done, done)
    }).then(toValue)
    .then(function (hasChanges) {
      expect(hasChanges).to.equal(false)
    })

    .executeAsync(function (done) {
      hoodie.store.add({foo: 'bar'})

      .then(function () {
        return hoodie.store.hasLocalChanges()
      })

      .then(done, done)
    }).then(toValue)
    .then(function (hasChanges) {
      expect(hasChanges).to.equal(true)
    })

    .executeAsync(function (done) {
      hoodie.account.signUp({
        username: 'storetest',
        password: 'secret'
      })

      .then(done, done)
    })

    .waitUntil(function () {
      return this.execute(function storeHasNoLocalChanges () {
        return hoodie.store.hasLocalChanges() === false
      })
    }, 10000)
  })

  // https://github.com/hoodiehq/hoodie-client/issues/44
  it.skip('.findAll() objects after signin', function () {
    return this.client

    .executeAsync(function (done) {
      hoodie.account.signIn({
        username: 'storetest',
        password: 'secret'
      })

      .then(done, done)
    })

    .waitUntil(function () {
      return this.executeAsync(function findsObjects (done) {
        hoodie.store.findAll().then(function (objects) {
          return objects.length === 1
        })
      })
    }, 10000)
  })
})
