/* eslint-env mocha */
'use strict'

var common = require('./common')
var zlib = require('../')

describe('zlib - dictionary fails', function () {
  it('should fail on missing dictionary', function (done) {
    // Should raise an error, not trigger an assertion in src/node_zlib.cc
    var stream = zlib.createInflate()

    stream.on('error', common.mustCall(function (err) {
      console.log(err.message)
      // assert(/Missing dictionary/.test(err.message))
      done()
    }))

    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78, 0xBB, 0x04, 0x09, 0x01, 0xA5]))
  })

  it('should fail on a bad dictionary', function (done) {
    // Should raise an error, not trigger an assertion in src/node_zlib.cc
    var stream = zlib.createInflate({ dictionary: Buffer('fail') })

    stream.on('error', common.mustCall(function (err) {
      console.log(err.message)
      // assert(/Bad dictionary/.test(err.message))
      done()
    }))

    // String "test" encoded with dictionary "dict".
    stream.write(Buffer([0x78, 0xBB, 0x04, 0x09, 0x01, 0xA5]))
  })
})
