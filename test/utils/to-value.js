module.exports = toValue

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
  return value && value.name && /error/i.test(value.name)
}
