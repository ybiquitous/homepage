/* eslint-env node */
import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {() => (tree: import("mdast").Root) => void} */
export default function remarkRemoveH1() {
  return (tree) => {
    visit(tree, { type: "heading", depth: 1 }, (_node, index, parent) => {
      if (parent && typeof index === "number") {
        parent.children.splice(index, 1);
      }
    });
  };
}
