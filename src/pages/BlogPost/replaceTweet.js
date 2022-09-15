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
        const message = document.createElement("div");
        message.textContent = "Failed to load the tweet :(";
        message.className = "my-text-secondary";
        message.style.marginBlockStart = "1rem";
        message.style.fontSize = "smaller";
        tweet.appendChild(message);
      } else {
        widgets.createTweet(tweet.getAttribute("data-tweet-id") ?? "", tweet, {
          theme: localStorage.getItem("theme"),
        });
        tweet.firstElementChild?.remove();
      }
    });
  }, 1500);
}
