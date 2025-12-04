import { visit } from "unist-util-visit";

/** @type {() => (tree: import("mdast").Root) => void} */
export default function remarkTwitter() {
  return (tree) => {
    visit(tree, "link", (link, index, parent) => {
      if (parent == null || index == null) return;
      if (!link.url.startsWith("http")) return;

      const url = new URL(link.url);

      // https://twitter.com/{username}/status/{tweet_id}
      // https://x.com/{username}/status/{tweet_id}
      if (url.protocol !== "https:") return;
      if (!(url.hostname === "twitter.com" || url.hostname === "x.com")) return;

      const [, , , tweetId] = url.pathname.split("/", 4);
      if (tweetId === undefined || tweetId === "") return;

      const href = url.toString();
      /** @type {import("mdast").Html} */
      const newNode = {
        type: "html",
        value: `
          <div data-tweet-id="${tweetId}" style="min-height: 200px;">
            <a href="${href}" target="_blank" rel="nofollow noopener noreferrer">${href}</a></div>
          </div>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
