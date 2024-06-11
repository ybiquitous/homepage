import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {() => (tree: import("mdast").Root) => void} */
export default function remarkSpeakerdeck() {
  return (tree) => {
    visit(tree, "link", (link, index, parent) => {
      if (parent == null || index == null) return;
      if (!link.url.startsWith("http")) return;

      // Consider the link as inline when it has siblings.
      if (parent.children.length !== 1) return;

      const url = new URL(link.url);

      // Convert a video URL:
      //   from: https://www.youtube.com/watch?v={id}
      //   to:   https://www.youtube.com/embed/{id}
      if (url.protocol !== "https:") return;
      if (url.hostname !== "www.youtube.com") return;
      if (url.pathname !== "/watch") return;

      const videoId = url.searchParams.get("v");
      if (videoId == null || videoId === "") return;

      url.pathname = `/embed/${videoId}`;
      url.search = "";

      let title = "";
      const [titleNode] = link.children;
      if (titleNode && "value" in titleNode) {
        title = titleNode.value === link.url ? "YouTube video player" : titleNode.value;
        title = `title="${title}"`;
      }

      const src = url.toString();
      /** @type {import("mdast").Html} */
      const newNode = {
        type: "html",
        value: `<iframe class="youtube-iframe" width="560" height="315" src="${src}" ${title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
