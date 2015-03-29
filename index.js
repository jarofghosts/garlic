var through = require('through2')
  , blt = require('blt')

module.exports = garlic

function garlic(createStream) {
  var bltStream = blt(setup)

  return bltStream

  function setup() {
    var garlicStream = through.obj(factory)

    return garlicStream

    function factory(tuple, _, next) {
      var stream = createStream(tuple)

      stream.on('data', function(data) {
        garlicStream.push([data, tuple])
      })

      stream.on('error', function() {
        garlicStream.emit('fail', tuple)
      })

      stream.on('end', function() {
        garlicStream.emit('ack', tuple)
      })

      stream.on('log', function(message) {
        garlicStream.emit('log', message)
      })

      stream.write(tuple.tuple[0])

      next()
    }
  }
}
