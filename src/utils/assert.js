/**
 * @type {(value: unknown) => asserts value}
 */
export const assert = (value) => {
  console.assert(Boolean(value));
};
