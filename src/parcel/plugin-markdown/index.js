module.exports = bundler => {
  bundler.addAssetType(".md", require.resolve("./asset"));
};
