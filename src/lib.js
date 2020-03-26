const { SHA3 } = require('sha3')
const seedrandom = require('seedrandom')

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
   * Randomly permute array in place using the Durstenfeld shuffle
   * @param {Array} array - array to permute
   * @param {string} seed - RNG seed
   */
  randomPermute: (array, seed) => {
    const rng = seedrandom(seed)
    const n = array.length
    for (let i = n - 1; i > 0; i--) {
      let randomFloat = rng()
      let j = Math.floor(randomFloat * n)
      // Swap elements at indices i and j
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  },

  /**
   * Consists of all non-empty IDs in lexicographical order, with all
   * whitespace removed, deduplicated, and separated by commas.
   * @param {Array} ids
   * @returns {Object}
   */
  serialize: (ids) => {
    const filtered = []
    ids.forEach((item) => {
      if (typeof item !== 'string') {
        return
      }
      const id = item.replace(/\s/g, '')
      if (id.length && !filtered.includes(id)) {
        filtered.push(id)
      }
    })
    filtered.sort()
    return {
      serialized: filtered.join(','),
      filtered
    }
  },

  /**
   * Randomly permutes a list of IDs using sha3(L) as the seed
   * @param {Array} ids - array to permute
   * @returns {Array}
   */
  permuteIDs: (ids) => {
    const s = module.exports.serialize(ids)
    module.exports.randomPermute(s.filtered, module.exports.hash(s.serialized))
    return s.filtered
  }
}
