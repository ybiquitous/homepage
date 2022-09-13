/**
 * @template T
 * @param {ReadonlyArray<T>} array
 * @returns {Array<T>}
 */
export function uniqueArray(array) {
  return [...new Set(array)];
}
