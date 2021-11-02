module.exports = function remarkLoader(...args) {
  return import("./remark-loader.js").then((loader) => loader.default(...args));
};
