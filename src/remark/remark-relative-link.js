/* eslint-env node */
const visit = require("unist-util-visit"); // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin} */
module.exports = function remarkRelativeLink() {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
    visit(tree, "link", (node) => {
      if ("url" in node && typeof node.url === "string" && !node.url.startsWith("http")) {
        // eslint-disable-next-line no-param-reassign -- Ignorable.
        node.url = node.url.replace(/\.md$/u, "");
      }
    });
  };
};
