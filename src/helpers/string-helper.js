import _ from "lodash"

/**
 * Truncate string with defined length
 * @param {String} str
 * @param {Number} num
 * @returns
 */
export function truncate(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "..."
  } else {
    return str
  }
}

/**
 * Check if string truncated or not
 * @param {String} str
 * @param {Number} num
 * @returns
 */
export function isTruncated(str, num) {
  return str.length > num ? true : false
}

/**
 * Capitalize first letter / each word
 * @param {string} string
 * @param {boolean} everyWord
 * @returns
 */
export function capitalizeFirstLetter(string, everyWord = false) {
  if (everyWord) {
    const words = string.split(" ")
    let newWords = ""
    let isLoopDone = false

    words.map((word, key) => {
      newWords = newWords + " " + word.charAt(0).toUpperCase() + word.slice(1)
      if (words.length - 1 === key) {
        isLoopDone = true
      }
    })

    if (isLoopDone) {
      return newWords
    }
  }

  if (everyWord === false) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}

/**
 * Mengambil inisial nama orang
 * @param {string} name
 * @param {integer} initialLength
 */
export function getInitialName(name, initialLength = 2) {
  const arrayName = name.split(" ")
  let isLoopDone = false
  let initialName = ""

  arrayName.map((name, key) => {
    if (key <= initialLength - 1) {
      initialName = initialName + name.charAt(0)
    }

    if (key === arrayName.length - 1) {
      isLoopDone = true
    }
  })

  if (isLoopDone) {
    return initialName
  }
}

/**
 * Mengubah string ke lower & snake case
 * @param {any} string
 */
export function lowerSnake(string) {
  if (_.isString(string)) {
    return string.replace(/ /g, "_").toLowerCase()
  }

  return ""
}
