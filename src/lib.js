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
   * @returns {Array}
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
    return array
  },

  /**
   * Consists of all IDs in lexicographical order, with all
   * whitespace removed, and separated by commas.
   * @param {Array} ids
   * @returns {string}
   */
  serialize: (ids) => {
    ids.forEach((id, index) => {
      ids[index] = id.replace(/\s/g, '')
    })
    ids.sort()
    return ids.join(',')
  },

  /**
   * Randomly permutes a list of IDs using sha3(L) as the seede
   * @param {Array} ids - array to permute
   * @returns {Array}
   */
  permuteIDs: (ids) => {
    const L = module.exports.serialize(ids)
    return module.exports.randomPermute(ids, module.exports.hash(L))
  }
}
