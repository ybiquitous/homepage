/* eslint-env node */
const visit = require("unist-util-visit"); // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin} */
module.exports = () => {
  return (tree) => {
    visit(tree, "link", (node) => {
      if ("url" in node && typeof node.url === "string" && !node.url.startsWith("http")) {
        node.url = node.url.replace(/\.md$/u, "");
      }
    });
  };
};
