const visit = require("unist-util-visit");

/** @type {import("unified").Plugin} */
module.exports = function removeMarkdownExtension() {
  return (tree) => {
    visit(tree, "link", (node) => {
      if ("url" in node && typeof node.url === "string") {
        node.url = node.url.replace(/\.md$/, "");
      }
    });
  };
};
