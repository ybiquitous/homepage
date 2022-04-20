interface Window {
  /**
   * @see https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function
   */
  twttr?: {
    widgets?: {
      createTweet<E extends Element>(
        tweetID: string,
        targetEl: E,
        options?: Record<string, unknown>
      ): Promise<E>;
    };
  };
}
