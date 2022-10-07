---
published: 2019-05-11T00:00:00.000Z
lastUpdated: 2019-05-12T00:00:00.000Z
author: Masafumi Koba
tags: typescript, react, parcel, netlify
---

# Blog始めました

Blogを始めました。最初は、このBlogを乗せているホームページの技術スタックについて書きます。

## 技術スタック

このウェブサイトは、主に次の4つの技術・サービスを用いています。すべて最新版で、常に最新版に更新しています。

-   [TypeScript](https://www.typescriptlang.org/)
-   [React](https://reactjs.org/)
-   [Parcel](https://parceljs.org/)
-   [Netlify](https://www.netlify.com/)

ざっくり言うと、TypeScript＆Reactでコードを書き、Parcelでビルドし、Netlifyにデプロイしています。

## 採用理由

次に、それぞれのスタックを採用した理由について書きます。

### TypeScript

ふだん仕事で使っていて、慣れているから、というのが主な理由です。特にReactとの相性がよいです。
型チェックがあるので [`PropTypes`](https://github.com/facebook/prop-types) を書く必要が無いし、DOM APIもいい感じに補完してくれます。

もはや、**TypeScriptなしでReactを書くことは考えられません**。

### React

こちらもふだん仕事で使っていて、書き慣れているからです。また、関数型をベースにしたReactの思想が好みだからでもあります。
コンポーネント（view）にデータ（props）を渡すと、副作用なしで `render` してくれる純粋関数を書いている感覚です。

基本的には、このTypeScriptとReactを使って、SPAとしてホームページのコードを書いてます。

### Parcel

最初は仕事で使っている[webpack](https://webpack.js.org/)と迷ったのですが、前から興味があったのと、ゼロコンフィグに惹かれて採用しました。
今のところ、本当にゼロコンフィグで書けていて、webpackより体験がよいです。webpackだと、CSSの設定をするのも一苦労です。

現在、ParcelではCSS、YAML、Markdownファイルをゼロコンフィグで `.tsx` ファイル（Reactコンポーネント）に `import` してます。

ただ、細かいところの制御はwebpackの方ができるので、Parcelを実際に仕事で使う場合は、ユースケースがだいぶ限られてくる気がします。

### Netlify

元々このホームページは[GitHub Pages](https://pages.github.com/)に乗せてたのですが、興味があったので一度試してみて、体験が良かったので乗り換えました。
GitHub Pagesの時はTravis CIでビルド&デプロイをしていたので、GitHubトークンの設定やらデプロイスクリプトやらを自分でやる必要がありました。

しかしNetlifyは、ビルドコマンドをNetlify UI上で登録しておけば、勝手にデプロイまでしてくれます。
また、Pull Request（PR）を投げたら、そのPRの状態でステージングサイトを公開してくれるので、安心してマージできます。
（さらに、壊れたリンクがあれば、PRのコミットステータスをエラーにしてくれます。その他にも色々チェックしてくれる）

静的なサイトであれば、Netlifyにデプロイするのが今のところベターかなと思っています。

## まとめ

以上が、簡単な説明となります。

このホームページのソースコードは[GitHubで公開](https://github.com/ybiquitous/homepage)してありますので、[`package.json`](https://github.com/ybiquitous/homepage/blob/master/package.json) に今回説明したスタックを見ることができます。
