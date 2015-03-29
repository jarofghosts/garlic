var proxyquire = require('proxyquire')
  , through = require('through2')
  , test = require('tape')

var garlicStream

var garlic = proxyquire('../', {
    'blt': getMockBlt
})

test('does not throw', function(t) {
  t.plan(1)

  t.doesNotThrow(function() {
    garlic(Function())
  })
})

test('translates stream events into blt events', function(t) {
  t.plan(4)

  var fakeStream = through.obj(write)
    , fakeTuple = {tuple: true}

  garlic(makeFakeStream)

  garlicStream.on('data', function(data) {
    t.deepEqual(data, ['rofl', fakeTuple])
  })

  garlicStream.on('fail', function(tuple) {
    t.deepEqual(tuple, fakeTuple)
  })

  garlicStream.on('ack', function(tuple) {
    t.deepEqual(tuple, fakeTuple)
  })

  garlicStream.on('log', function(message) {
    t.equal(message, 'lolcano')

    fakeStream.end()
  })

  garlicStream.write(fakeTuple)

  function write(data, _, next) {
    this.push('rofl')
    this.emit('error', new Error('iunno'))
    this.emit('log', 'lolcano')

    next()
  }

  function makeFakeStream() {
    return fakeStream
  }
})

function getMockBlt(fn) {
  garlicStream = fn()
}
