module.exports = (bundler) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  bundler.addAssetType(".md", require.resolve("./asset"));
};
