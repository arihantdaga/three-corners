'use strict'

var error = new Error('DOOM!')

var wrapAsync = require('../').wrapAsync

module.exports = function (t) {
  t.plan(4)

  t.test('no args', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(noExtraArgs)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(noExtraArgsError)

      wrapped(function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(noExtraArgsDelayed)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 3)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(noExtraArgsErrorDelayed)

      wrapped(function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('one argument', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(oneArgument)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(oneArgumentError)

      wrapped(3, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(oneArgumentDelayed)

      wrapped(3, function (err, result) {
        t.error(err)
        t.equal(result, 6)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(oneArgumentErrorDelayed)

      wrapped(3, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('lot of arguments', function (t) {
    t.plan(4)

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(lotOfArguments)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(lotOfArgumentsError)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })

    t.test('delayed', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(lotOfArgumentsDelayed)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.error(err)
        t.equal(result, 21)
      })
    })

    t.test('delayed error', function (t) {
      t.plan(2)

      var wrapped = wrapAsync(lotOfArgumentsErrorDelayed)

      wrapped(1, 2, 3, 4, 5, 6, function (err, result) {
        t.equal(err, error)
        t.equal(result, undefined)
      })
    })
  })

  t.test('with this', function (t) {
    t.plan(2)

    var obj = {
      b: 66,
      func: async function () {
        return Promise.resolve(this.b)
      },
      func2: async function (a, b, c) {
        return Promise.resolve(this.b + a + b + c)
      }
    }

    t.test('sync', function (t) {
      t.plan(2)

      var wrapped = wrapAsync('func', obj)

      wrapped(function (err, result) {
        t.error(err)
        t.equal(result, 66)
      })
    })

    t.test('multiple args', function (t) {
      t.plan(2)

      var wrapped = wrapAsync('func2', obj)

      wrapped(1, 2, 3, function (err, result) {
        t.error(err)
        t.equal(result, 66 + 1 + 2 + 3)
      })
    })
  })
}

const n = 3
async function noExtraArgs () {
  return n
}

async function noExtraArgsError () {
  throw error
}

async function noExtraArgsDelayed () {
  await new Promise(function (resolve) {
    setTimeout(resolve, 10)
  })
  return 3
}

async function noExtraArgsErrorDelayed () {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, 10)
  })
  throw error
}

const multiplier = 2
async function oneArgument (n) {
  return n * multiplier
}

async function oneArgumentError (n) {
  throw error
}

async function oneArgumentDelayed (n) {
  await new Promise(function (resolve) {
    setTimeout(resolve, 10)
  })
  return n * multiplier
}

async function oneArgumentErrorDelayed (n) {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, 10)
  })
  throw error
}

async function lotOfArguments (a, b, c, d, e, f) {
  return a + b + c + d + e + f
}

async function lotOfArgumentsError (a, b, c, d, e, f) {
  throw error
}

async function lotOfArgumentsDelayed (a, b, c, d, e, f) {
  await new Promise(function (resolve) {
    setTimeout(resolve, 10)
  })
  return a + b + c + d + e + f
}

async function lotOfArgumentsErrorDelayed (a, b, c, d, e, f) {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, 10)
  })
  throw error
}

if (require.main === module) {
  var t = require('tap')
  module.exports(t)
}
