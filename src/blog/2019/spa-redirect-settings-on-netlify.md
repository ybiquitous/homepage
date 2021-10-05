# SPAのためのリダイレクト設定 on Netlify

このブログは現在[Netlify](https://www.netlify.com/)上にデプロイしているのですが、404ページがNetlifyが用意したものだったので、ちょっとイケてないなぁと思っていました。

この記事では、どうやって専用の404ページを用意したのかを説明します。というか、記事のタイトルがすでに答えになっています。

## 答え

プロジェクトルートに `_redirects` ファイルを用意して、こう書くだけです。

```
/*    /index.html   200
```

[Netlifyのドキュメント](https://www.netlify.com/docs/redirects/#rewrites-and-proxying)には、こうあります。

> If you’re developing a single page app and want history pushstate to work so you get clean URLs, you’ll want to enable the following rewrite rule:
> (…)
> This will effectively serve the index.html instead of giving a 404 no matter what URL the browser requests.

（私訳）「もしシングルページアプリケーション（SPA）を開発していて、クリーンなURLで履歴のpushStateをしたいのであれば、次のリライトルールを有効にしたいと思うでしょう。
(…)
このルールは、ブラウザがどのURLをリクエストしても、404を与える代わりにindex.htmlを効果的に提供します。」

これだけです。ちなみに、このサイトのリダイレクト設定は[ここ](https://github.com/ybiquitous/homepage/blob/f21b1e5963607f5b6fd9a3b114efeb0786093ffe/_redirects#L1)にあります。

ただし、この設定だとHTTPステータスは **404** ではなく **200** を返します。これはHTTP原理主義者にとっては不満かも知れませんが、このサイトとしてはこれで十分です。むしろ404ステータスを変えそうとすると、何らかのハックが必要になるでしょう。

## 経緯

この変更を導入したプルリクエストは [ybiquitous/homepage#93](https://github.com/ybiquitous/homepage/pull/93) です。

オリジナルの `_redirects` には、こう書いていました。

```
/blog      /    200
/blog/*    /    200
```

そして、ルーティングはこのようになっていました（[コード](https://github.com/ybiquitous/homepage/blob/f21b1e5963607f5b6fd9a3b114efeb0786093ffe/src/routes.tsx#L21-L27)）。

```ts
export const routes: Routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "/slides": () => <Slides />,
  "*": () => <NotFound />,
};
```

`/` へのアクセスはNetlifyがデフォルトで `/index.html` に転送してくれるのですが、他のURLを書かないとページをリロードしたときに404になってしまいます。そこで、`/blog` や `/blog/*` の設定を追加していたのでした（そうしないといけないと思い込んでました…）。

このようにルーティングを追加するたびに `_redirects` を更新しないといけないのはツラく、実際に `/slides` を追加したときに更新を忘れてました。

試行錯誤しながら上記のNetlifyドキュメントを見つけたときは、目からウロコの思いでしたが、考えてみれば当たり前のことでした…。

## 教訓

SPAのルーティングを実装したときは、サーバーサイドでのリダイレクト設定を忘れずに行いましょう。ほとんどのSPAにとっては、ページリロードしたときに元のページが表示されることを期待するはずです。

そして、Netlifyでは `_redirects` ファイルに

```
/*    /index.html   200
```

を設定しておきましょう（大事なことなので繰り返し）！
