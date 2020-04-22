'use strict'
const { SHA3 } = require('sha3')

/**
 * Converts UTC midnight of local YYYY-MM-DD string to ms since 1970-01-01 UTC
 * and gets NIST beacon for that time.
 * @param {string} dateString
 * @returns {number}
 */
const fetchNistBeacon = async (dateString, tzCode) => {
  if (!tzCode || tzCode.length !== 6 || tzCode[3] !== ':') {
    throw new Error('Invalid time zone.')
  }
  const date = Date.parse(`${dateString}T00:00:00.000${tzCode}`)
  if (!date) {
    throw new Error('Invalid date.')
  }
  const url = `https://beacon.nist.gov/beacon/2.0/pulse/time/${date}`
  const resp = await window.fetch(url)
  const json = await resp.json()
  return json.pulse.outputValue
}

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
   * @param {string} salt
   * @param {Object} outputs
   */
  idToHash: (id, salt, outputs) => {
    if (typeof id !== 'string') {
      return
    }
    id = id.replace(/\s/g, '').toLowerCase()
    if (id.length) {
      const input = [salt, id].join('|')
      outputs[module.exports.hash(input)] = id
    }
  },

  /**
   * Computes a permutation of the IDs based on the hash
   * @param {Array} ids
   * @param {string} date
   * @returns {Array}
   */
  permuteIDs: async (ids, date, tzCode) => {
    const salt = await fetchNistBeacon(date, tzCode)
    const hashesToIds = {}
    ids.forEach((id) => module.exports.idToHash(id, salt, hashesToIds))
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
   * @returns {string}
   */
  getDate: (d) => {
    d = d || new Date()
    const month = String(d.getMonth() + 1)
    const date = String(d.getDate())
    const monthString = month.length < 2 ? `0${month}` : month
    const dateString = date.length < 2 ? `0${date}` : date
    return [d.getFullYear(), monthString, dateString].join('-')
  },

  /**
  * Returns local timezone's offset from UTC as a string
  * +/- HH:MM, e.g. -04:00
  */
  getTZCode: (d) => {
    d = d || new Date()
    const s = d.toString().split('GMT')[1]
    return [s.slice(0, 3), s.slice(3, 5)].join(':')
  }
}
