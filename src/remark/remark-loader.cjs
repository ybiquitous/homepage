// @ts-nocheck
// TODO: When Webpack supports ESM fully, this bridge module (CJS to ESM) will be no longer necessary.
module.exports = function remarkLoader(...args) {
  return import("./remark-loader.js").then((loader) => loader.default(...args));
};
