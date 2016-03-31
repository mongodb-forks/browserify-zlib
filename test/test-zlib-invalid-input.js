/* eslint-env mocha */
'use strict'

// test uncompressing invalid input
const assert = require('assert')
const zlib = require('../')

var nonStringInputs = [1, true, {a: 1}, ['a']]

describe('zlib - invalid input', function () {
  it('non strings', function (done) {
    nonStringInputs.forEach(function (input) {
      // zlib.gunzip should not throw an error when called with bad input.
      assert.doesNotThrow(function () {
        zlib.gunzip(input, function (err, buffer) {
          // zlib.gunzip should pass the error to the callback.
          assert.ok(err)
          done()
        })
      })
    })
  })

  it('unzips', function (done) {
    // zlib.Unzip classes need to get valid data, or else they'll throw.
    var unzips = [
      zlib.Unzip(),
      zlib.Gunzip(),
      zlib.Inflate(),
      zlib.InflateRaw()
    ]
    var hadError = []

    var finish = function (i) {
      hadError[i] = true
      if (hadError.length === 4) {
        assert.deepEqual(hadError, [true, true, true, true], 'expect 4 errors')
      }
    }
    unzips.forEach(function (uz, i) {
      uz.on('error', function (er) {
        finish(i)
      })

      uz.on('end', function (er) {
        throw new Error('end event should not be emitted ' + uz.constructor.name)
      })

      // this will trigger error event
      uz.write('this is not valid compressed data.')
    })
  })
})
