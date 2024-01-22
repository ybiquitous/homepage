const table = new Map([
  ["post", "posts"],
  ["tag", "tags"],
]);

/**
 * @example
 * pluralize(0, "post"); //=> "posts"
 *
 * @param {number} count
 * @param {string} singular
 * @returns {string}
 */
export function pluralize(count, singular) {
  return count === 1 ? singular : table.get(singular) ?? singular;
}
