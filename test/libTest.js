/* eslint-env mocha */
'use strict'

const assert = require('assert')
const lib = require('../src/lib')

describe('hash', () => {
  it('returns known output', () => {
    assert.strict.equal(
      lib.hash('abc'),
      'b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0'
    )
    assert.strict.equal(
      lib.hash(''),
      'a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26'
    )
    assert.strict.equal(
      lib.hash('abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu'),
      'afebb2ef542e6579c50cad06d2e578f9f8dd6881d7dc824d26360feebf18a4fa73e3261122948efcfd492e74e82e2189ed0fb440d187f382270cb455f21dd185'
    )
  })
  it('throws on non-string input', () => {
    assert.throws(() => {
      lib.hash(123)
    })
  })
})

describe('randomPermute', () => {
  it('is deterministic', () => {
    const array1 = ['this', 'is', 'A', 'test']
    const array2 = ['this', 'is', 'A', 'test']
    const seed = 'kfjdklffadjfda'
    lib.randomPermute(array1, seed)
    lib.randomPermute(array2, seed)
    assert.strict.deepEqual(array1, array2)
    assert.strict.deepEqual(array1, ['A', 'this', 'test', 'is'])
  })
  it('gives different results for different seeds', () => {
    const array1 = ['this', 'is', 'A', 'test']
    const array2 = ['this', 'is', 'A', 'test']
    lib.randomPermute(array1, 'foo')
    lib.randomPermute(array2, 'bar')
    assert.strict.deepEqual(array1, ['test', 'this', 'A', 'is'])
    assert.strict.deepEqual(array2, ['this', 'A', 'test', 'is'])
  })
})

describe('serialize', () => {
  it('serializes', () => {
    assert.strict.equal(lib.serialize(['']).serialized, '')
    assert.strict.equal(lib.serialize(['', 'a', 'B B', 39]).serialized, 'a,bb')
    assert.strict.equal(lib.serialize(['a', 'd', ' c', 39, 'b']).serialized,
      'a,b,c,d')
    assert.strict.equal(lib.serialize(['a', 'd', ' c', 'c', 'b']).serialized,
      'a,b,c,d')
    assert.strict.equal(lib.serialize(['328-382', '393', ' -e3']).serialized,
      '-e3,328-382,393')
  })
})

describe('permuteIDs', () => {
  it('is deterministic', () => {
    const res = lib.permuteIDs(['hello', 'this', 'is', 'number', '42'])
    const res2 = lib.permuteIDs(['hello', 'this', 'is', 'number', '42'])
    assert.strict.deepEqual(res, ['hello', 'is', 'this', '42', 'number'])
    assert.strict.deepEqual(res2, ['hello', 'is', 'this', '42', 'number'])
  })
  it('filters out dupes and invalid inputs', () => {
    const res = lib.permuteIDs(['hello', '', 'this', 'is', 'number', 42, 'hello'])
    assert.strict.deepEqual(res, ['hello', 'number', 'this', 'is'])
  })
  it('gives same results given a fixed date', () => {
    const date = '1983-12-01'
    const res1 = lib.permuteIDs(['1', '2', '3'], date)
    const res2 = lib.permuteIDs(['1', '2', '3'], date)
    assert.strict.deepEqual(res1, ['1', '3', '2'])
    assert.strict.deepEqual(res2, ['1', '3', '2'])
    const res3 = lib.permuteIDs(['1', '2', '3'], '2020-01-01')
    assert.strict.deepEqual(res3, ['1', '2', '3'])
  })
})

describe('getDate', () => {
  it('returns a correctly formatted string', () => {
    const date = lib.getDate()
    const split = date.split('-')
    assert(split.length === 3)
    assert(split[0].length === 4)
    assert(split[1].length === 2)
    assert(split[2].length === 2)
  })
})
