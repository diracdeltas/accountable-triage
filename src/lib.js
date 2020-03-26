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
   * Sample uniformly at random from nonnegative integers below a specified
   * bound.
   * @param {number} n - exclusive upper bound
   * @param {function} rng - rng returning a float between 0 and 1
   * @returns {number}
   */
  uniform: (n, rng) => {
    if (typeof n !== 'number' || n % 1 !== 0 || n <= 0) {
      throw new Error('Bound must be positive integer.')
    }
    // TODO: investigate best algorithm from
    // https://github.com/davidbau/seedrandom#other-fast-prng-algorithms
    const randomFloat = rng()
    return Math.floor(randomFloat * n)
  },

  /**
   * Randomly permute array in place using the Durstenfeld shuffle
   * @param {Array} array - array to permute
   * @param {string} seed - RNG seed
   * @returns {Array}
   */
  randomPermute: (array, seed) => {
    const rng = seedrandom(seed)
    for (let i = array.length - 1; i > 0; i--) {
      let j = module.exports.uniform(i, rng)
      // Swap elements at indices i and j
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },

  /**
   * Randomly permutes a list of IDs using the sha3(L) as the seed, where
   * L consists of all IDs in lexicographical order, with all
   * whitespace removed, and separated by commas.
   * @param {Array} array - array to permute
   * @returns {Array}
   */
  permuteIDs: (array) => {
    array.forEach((id, index) => {
      array[index] = id.replace(/\s/g, '')
    })
    array.sort()
    const L = array.join(',')
    return module.exports.randomPermute(array, module.exports.hash(L))
  }
}
