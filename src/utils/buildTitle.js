const base = "@ybiquitous";
const separator = " - ";

/**
 * @param {ReadonlyArray<string | null | undefined>} title
 * @returns {string}
 */
export function buildTitle(...title) {
  return title.length === 0 ? base : [...title, base].filter(Boolean).join(separator);
}
