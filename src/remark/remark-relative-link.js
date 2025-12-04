import { visit } from "unist-util-visit";

/** @type {() => (tree: import("mdast").Root) => void} */
export default function remarkRelativeLink() {
  return (tree) => {
    visit(tree, "link", (link) => {
      if (link.url.startsWith("http")) return;
      if (!link.url.includes(".md")) return;

      link.url = link.url.replace(/\.md/u, "");
    });
  };
}
