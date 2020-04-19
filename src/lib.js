'use strict'
const { SHA3 } = require('sha3')

module.exports = {
  /**
   * Gets SHA3 hash of some input string.
   * @param {string} input
   * @returns {string}
   */
  hash: (input) => {
    const hash = new SHA3(512)
    hash.update(input)
    return hash.digest('hex')
  },

  /**
   * Takes hash of date + normalized ID, copys it to a map of hash to ID
   * @param {string} id
   * @param {string} date
   * @param {Object} outputs
   */
  idToHash: (id, date, outputs) => {
    if (typeof id !== 'string') {
      return
    }
    id = id.replace(/\s/g, '').toLowerCase()
    if (id.length) {
      const input = [date, id].join('|')
      outputs[module.exports.hash(input)] = id
    }
  },

  /**
   * Computes a permutation of the IDs based on the hash
   * @param {Array} ids
   * @param {string} date
   * @returns {Array}
   */
  permuteIDs: (ids, date) => {
    const hashesToIds = {}
    ids.forEach((id) => module.exports.idToHash(id, date, hashesToIds))
    // Sorts lexicographically. This should be equivalent to
    // sorting numerically in this case since hashes are equal length hex.
    // Ex: ['0f', 'a'].sort() => ['0f', 'a']
    //     ['0f', '0a'].sort() => ['0a', '0f']
    const sortedHashes = Object.keys(hashesToIds).sort()
    // Return array of IDs sorted by hash
    return sortedHashes.map(hash => hashesToIds[hash])
  },

  /**
   * Gets current day (YYYY-MM-DD) in local time
   * Note month is 1-indexed
   * @returns {string}
   */
  getDate: (d) => {
    d = d || new Date()
    const month = String(d.getMonth() + 1)
    const date = String(d.getDate())
    const monthString = month.length < 2 ? `0${month}` : month
    const dateString = date.length < 2 ? `0${date}` : date
    return [d.getFullYear(), monthString, dateString].join('-')
  }
}
