/**
 * @param {HTMLElement} el
 * @returns {void}
 */
export function replaceTweet(el) {
  const { twttr } = window;
  if (typeof twttr === "undefined") return;

  setTimeout(() => {
    const { widgets } = twttr;
    if (typeof widgets === "undefined") return;

    el.querySelectorAll("[data-tweet-id]").forEach((tweet) => {
      widgets.createTweet(tweet.getAttribute("data-tweet-id") ?? "", tweet, {
        theme: localStorage.getItem("theme"),
      });
      tweet.firstElementChild?.remove();
    });
  }, 1500);
}
