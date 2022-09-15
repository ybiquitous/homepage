/**
 * @param {HTMLElement} el
 * @returns {void}
 */
export function replaceTweet(el) {
  const { twttr } = window;
  if (typeof twttr === "undefined") return;

  setTimeout(() => {
    const { widgets } = twttr;

    el.querySelectorAll("[data-tweet-id]").forEach((tweet) => {
      if (typeof widgets === "undefined") {
        tweet.innerHTML += `
          <div class="my-text-secondary" style="margin-top: 1rem;">
            <small>Failed to load the tweet :(</small>
          </div>
        `;
      } else {
        widgets.createTweet(tweet.getAttribute("data-tweet-id") ?? "", tweet, {
          theme: localStorage.getItem("theme"),
        });
        tweet.firstElementChild?.remove();
      }
    });
  }, 1500);
}
