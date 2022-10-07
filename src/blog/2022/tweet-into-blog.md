---
slug: 2022/tweet-into-blog
title: Tweet into Blog
published: 2022-04-23T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: markdown, remark, twitter
---

# Tweet into Blog

当ブログにTwitterのリッチなカードを表示させたくて、試行錯誤して実現できたので、その備忘録。

## 仕様

- MarkdownファイルにTweetリンクを埋め込む。例: `https://twitter.com/{username}/status/{id}`
- Tweetカードが表示される。

## 例

[Masafumi Koba 🇺🇦 on Twitter: "個人ブログのMarkdownにTweetを埋め込んでみた。 https://t.co/jbFy9SRREh" / Twitter](https://twitter.com/ybiquitous/status/1517747618386157575)

## 実装

Pull request: [ybiquitous/homepage#852](https://github.com/ybiquitous/homepage/pull/852)

実装戦略は次の通り。

1. remarkでMarkdown内のTweetリンクを特殊なHTML要素に変換する。
2. 変換された特殊HTML要素に対してTwitter widgetを使う。

### remark

当ブログではMarkdownパーサとして[remark](https://remark.js.org/)というJSライブラリを使っている。

参考: [Webpack remark-loaderの代わりを作った話](../2021/yet-another-remark-loader.md)

このremarkを使って、`https://twitter.com/{username}/status/{id}` 形式の単純なリンクを `<div data-tweet-id="{id}">...</div>` HTMLに書き換えるプラグインを作った。

プラグインのコードは30行ほど：
[homepage/remark-twitter.js at 308de8f210f60237841c188a543430ed2bc8be30 · ybiquitous/homepage](https://github.com/ybiquitous/homepage/blob/308de8f210f60237841c188a543430ed2bc8be30/src/remark/remark-twitter.js)

以下はエッセンスを抜粋したコード：

```js
import { visit } from "unist-util-visit";

export default function remarkTwitter() {
  return (tree) => {
    visit(tree, "link", (node, index, parent) => {
      // リンクURLを取り出す
      const url = new URL(node.url);

      // URLパスからTweet IDを取り出す
      const [_root, _username, _status, tweetId] = url.pathname.split("/", 4);

      // リンクノードをHTMLノードで置き換える
      const newNode = {
        type: "html",
        value: `<div data-tweet-id="${tweetId}">...</div>`,
      };
      parent.children.splice(index, 1, newNode);
    });
  };
}
```

この `remarkTwitter` プラグインを、Markdown→HTMLの変換パイプラインに流し込むことで、Markdownファイルに書いたTweetリンクが `<div data-tweet-id>` 要素として書き出される。

### Twitter widget

remarkの処理はWebpackビルド時に実行されるが、実際のTwitterカードに描画する処理はブラウザ上で実行される。

まずは、Twitter widgetライブラリをページにセットアップする。以下のTwitter公式ドキュメントを参考にした。

[Set up Twitter for Websites | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites)

`https://platform.twitter.com/widgets.js` を読み込む `<script>` スニペットがあるので、それを `index.html` に貼り付ける。
実際Blog以外のページではTwitter widgetは使わないのだが、当サイトはSPAとなっていて分岐の処理がめんどくさいので単に貼り付けるだけにした。

ページにアクセスしたときにTwitter widgetが正しく読み込まれれば `window.twttr.widgets` というグローバル変数が使えるようになる。
このグローバル変数を使って、Reactの `useEffect()` フック内で `<div data-tweet-id>` DOM要素にTwitter widgetをマウントさせればよい。
これも以下の公式ドキュメントを参考にした。

[Embedded Tweet JavaScript Factory Function | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-javascript-factory-function)

`useEffect()` 内のコードを抜粋すると以下のようなイメージ：

```js
// うまくマウントできないケースがあるので、少し遅延させる
setTimeout(() => {
  // `data-tweet-id` 属性をもつ要素を探す
  content.querySelectorAll("[data-tweet-id]").forEach((tweet) => {
    // Tweet IDをTwitter widgetに渡す。これでTweetカードが描画される
    twttr.widgets.createTweet(tweet.getAttribute("data-tweet-id") ?? "", tweet, {
      theme: localStorage.getItem("theme"), // Dark mode対応
    });

    // カードと置き換えられた要素は削除する
    tweet.firstElementChild?.remove();
  });
}, 1500);
```

`setTimeout()` を使っているのが微妙だけど、まあ許容範囲内かな、と思う。いい方法があれば書き換える。

## まとめ

remarkのプラグインシステムが優秀なのと、Twitter widgetが公式にサポートされていたため、簡単に実現できた。

できればGistも実現したいんだけど、Gistは公式widgetが見当たらないんだよなぁ…。
「React Gist」で検索するといくつかヒットするけど、どうもGitHub公式じゃなさそう。
公式じゃないといつ壊れるかわからないし、サードパーティライブラリを使うのも微妙な気がしてる。
