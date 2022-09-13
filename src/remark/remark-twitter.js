/* eslint-env node */
import { visit } from "unist-util-visit"; // eslint-disable-line import/no-extraneous-dependencies

/** @type {import("unified").Plugin<undefined, import("mdast").Root>} */
export default function remarkTwitter() {
  return (tree) => {
    visit(tree, "link", (node, index, parent) => {
      if (parent == null || index == null) return;
      if (!node.url.startsWith("http")) return;

      const url = new URL(node.url);

      // https://twitter.com/{username}/status/{tweet_id}
      if (url.protocol !== "https:") return;
      if (url.hostname !== "twitter.com") return;

      const [, , , tweetId] = url.pathname.split("/", 4);
      if (tweetId === undefined || tweetId === "") return;

      /** @type {import("mdast").HTML} */
      const newNode = {
        type: "html",
        value: `
          <div data-tweet-id="${tweetId}" style="min-height: 200px;">
            <a href="${String(url)}" target="_blank" rel="nofollow noopener noreferrer">${String(url)}</a></div>
          </div>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
