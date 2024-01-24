import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {() => (tree: import("mdast").Root) => void} */
export default function remarkSpeakerdeck() {
  return (tree) => {
    visit(tree, "link", (link, index, parent) => {
      if (parent == null || index == null) return;
      if (!link.url.startsWith("http")) return;

      const url = new URL(link.url);

      // https://speakerdeck.com/player/{id}
      if (url.protocol !== "https:") return;
      if (url.hostname !== "speakerdeck.com") return;
      if (!/^\/player\/[^/]+$/u.test(url.pathname)) return;

      let title = "";
      const [titleNode] = link.children;
      if (titleNode && "value" in titleNode) {
        title = titleNode.value;
        title = `title="${title}"`;
      }

      const src = url.toString();
      /** @type {import("mdast").Html} */
      const newNode = {
        type: "html",
        value: `<iframe class="speakerdeck-iframe" style="border: 0px none; background: rgba(0, 0, 0, 0.1) none repeat scroll 0% 0% padding-box; margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 560px; height: 315px;" src="${src}" ${title} allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" data-ratio="1.777" frameborder="0"></iframe>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
