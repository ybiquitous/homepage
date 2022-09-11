/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {Array<T>}
 */
export function uniqueArray(iterable) {
  return [...new Set(iterable)];
}
