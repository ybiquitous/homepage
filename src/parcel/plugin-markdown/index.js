/**
 * @param {import("parcel-bundler")} bundler
 */
module.exports = (bundler) => {
  bundler.addAssetType(".md", require.resolve("./asset"));
};
