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

describe('idToHash', () => {
  it('normalizes the ID', () => {
    const date = '2020-04-04'
    const output = {}
    lib.idToHash('', date, output)
    lib.idToHash(' ', date, output)
    lib.idToHash(undefined, date, output)
    lib.idToHash('123', date, output)
    lib.idToHash(' 4   5  6     ', date, output)
    lib.idToHash('aZUki', date, output)
    lib.idToHash('ABC 11111 0000000000', date, output)
    assert.strict.deepEqual(output, {
      '0c395fe62e46cd4ac547437d8f10ad897b61781ee31530fcc2acded9ede3c1e7539a578e161289bf4b5693254eca6f4c0dc190cf1728a2aab3daf742de74d5c8': 'abc111110000000000',
      'a39878927fe717f4f0135e37a2ea55b0d03b638921fc35aeec00897d4213c4f2c104389c2d820d4e5cd8b8364e772ed8a9f7e1831f1444799184a8412a2b5ccd': '123',
      '385317ff17c0acfd6c92f8fbb11f8af1390b97733183f19bc02be5c71eb7d23bfa1ebd7f3a16e980df6a8fd470dc9ae3296e097d9b5084cbd46d1d3908cccec4': '456',
      '822af1ded907b8b455210b2c99005eb9a87f34c21c9e70951da4d33f8b7434e03e8563c2bcc209109ad1194553809cb844bfdc18c858d355bc9bdae6feb15656': 'azuki'
    })
  })
})

describe('permuteIDs', () => {
  it('is deterministic', () => {
    const res = lib.permuteIDs(['hello', 'this', 'is', 'number', '42'])
    const res2 = lib.permuteIDs(['hello', 'this', 'is', 'number', '42'])
    assert.strict.deepEqual(res, ['is', 'this', '42', 'number', 'hello'])
    assert.strict.deepEqual(res2, ['is', 'this', '42', 'number', 'hello'])
  })
  it('filters out dupes and invalid inputs', () => {
    const res = lib.permuteIDs(['hello', '', 'this', 'is', 'number', 42, 'hello'])
    assert.strict.deepEqual(res, ['is', 'this', 'number', 'hello'])
  })
  it('gives same results given a fixed date', () => {
    const date = '1983-12-01'
    const res1 = lib.permuteIDs(['1', '2', '3'], date)
    const res2 = lib.permuteIDs(['1', '2', '3'], date)
    assert.strict.deepEqual(res1, ['2', '3', '1'])
    assert.strict.deepEqual(res2, ['2', '3', '1'])
    const res3 = lib.permuteIDs(['1', '2', '3'], '2020-01-01')
    assert.strict.deepEqual(res3, ['2', '1', '3'])
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
