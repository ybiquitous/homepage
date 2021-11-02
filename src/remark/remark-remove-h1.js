/* eslint-env node */
import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin} */
export default function remarkRemoveH1() {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
  return (tree) => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
    visit(tree, { type: "heading", depth: 1 }, (_node, index, parent) => {
      if (parent) {
        parent.children.splice(index, 1);
      }
    });
  };
}
