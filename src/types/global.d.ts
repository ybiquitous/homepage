// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  /**
   * @see https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function
   */
  twttr?: {
    widgets?: {
      createTweet: <E extends Element>(
        tweetID: string,
        targetEl: E,
        options?: ReadonlyRecord<string, unknown>
      ) => Promise<E>;
    };
  };
}
