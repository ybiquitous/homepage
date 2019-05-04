# Blog 始めました

Blog を始めました。最初は、この Blog を乗せているホームページの技術スタックについて書きます。

## 技術スタック

このウェブサイトは、主に次の 4 つの技術・サービスを用いています。すべて最新版で、常に最新版に更新しています。

-   [TypeScript](https://www.typescriptlang.org/)
-   [React](https://reactjs.org/)
-   [Parcel](https://parceljs.org/)
-   [Netlify](https://www.netlify.com/)

ざっくり言うと、TypeScript & React でコードを書き、Parcel でビルドし、Netlify にデプロイしています。

## 採用理由

次に、それぞれのスタックを採用した理由について書きます。

### TypeScript

ふだん仕事で使っていて、慣れているから、というのが主な理由です。特に React との相性がよいです。
型チェックがあるので[`PropTypes`](https://github.com/facebook/prop-types)を書く必要が無いし、DOM API もいい感じに補完してくれます。

もはや、**TypeScript なしで React を書くことは考えられません**。

### React

こちらもふだん仕事で使っていて、書き慣れているからです。また、関数型をベースにした React の思想が好みだからでもあります。
コンポーネント（view）にデータ（props）を渡すと、副作用なしで `render` してくれる純粋関数を書いている感覚です。

基本的には、この TypeScript と React を使って、SPA としてホームページのコードを書いてます。

### Parcel

最初は仕事で使っている[webpack](https://webpack.js.org/)と迷ったのですが、前から興味があったのと、ゼロコンフィグに惹かれて採用しました。
今のところ、本当にゼロコンフィグで書けていて、webpack より体験がよいです。webpack だと、CSS の設定をするのも一苦労です。

現在、Parcel では CSS、YAML、Markdown ファイルをゼロコンフィグで `.tsx` ファイル（React コンポーネント）に `import` してます。

ただ、細かいところの制御は webpack の方ができるので、Parcel を実際に仕事に使う場合は、ユースケースがだいぶ限られてくる気がします。

### Netlify

元々このホームページは[GitHub Pages](https://pages.github.com/)に乗せてたのですが、興味があったので一度試してみて、体験が良かったので乗り換えました。
GitHub Pages の時は Travis CI でビルド&デプロイをしていたので、GitHub トークンの設定やらデプロイスクリプトやらを自分でやる必要がありました。

しかし Netlify は、ビルドコマンドを Netlify UI 上で登録しておけば、勝手にデプロイまでしてくれます。
また、Pull Request（PR）を投げたら、その PR の状態でステージングサイトを公開してくれるので、安心してマージすることができます。
（さらに、壊れたリンクがあれば、PR のコミットステータスをエラーにしてくれます。その他にも色々チェックしてくれる）

静的なサイトであれば、Netlify にデプロイするのが今のところベターかなと思っています。

## まとめ

以上が、簡単な説明となります。

このホームページのソースコードは[GitHub で公開](https://github.com/ybiquitous/homepage)してありますので、[`package.json`](https://github.com/ybiquitous/homepage/blob/master/package.json)に今回説明したスタックを見ることができます。
