/* eslint-env node */
import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin<unknown, import("mdast").Root>} */
export default function remarkRelativeLink() {
  return (tree) => {
    visit(tree, "link", (node) => {
      if (!node.url.startsWith("http")) {
        node.url = node.url.replace(/\.md$/u, ""); // eslint-disable-line no-param-reassign
      }
    });
  };
}
