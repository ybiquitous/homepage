/* eslint-env node */
import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin<undefined, import("mdast").Root>} */
export default function remarkSpeakerdeck() {
  return (tree) => {
    visit(tree, "link", (node, index, parent) => {
      if (parent == null || index == null) return;
      if (!node.url.startsWith("http")) return;

      const url = new URL(node.url);

      // https://speakerdeck.com/player/{id}
      if (url.protocol !== "https:") return;
      if (url.hostname !== "speakerdeck.com") return;
      if (!/^\/player\/[^/]+$/u.test(url.pathname)) return;

      let title = "";
      const [titleNode] = node.children;
      if (titleNode && "value" in titleNode) {
        title = titleNode.value;
        title = `title="${title}"`;
      }

      const src = url.toString();
      /** @type {import("mdast").HTML} */
      const newNode = {
        type: "html",
        value: `<iframe class="speakerdeck-iframe" style="border: 0px none; background: rgba(0, 0, 0, 0.1) none repeat scroll 0% 0% padding-box; margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 314px;" src="${src}" ${title} allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" data-ratio="1.78343949044586" frameborder="0"></iframe>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
