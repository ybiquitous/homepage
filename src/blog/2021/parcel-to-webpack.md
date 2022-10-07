---
published: 2021-06-23T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: parcel, webpack
---

# ParcelからWebpackに移行した話

[このブログを始めた](../2019/start-blog.md)ときからずっと[Parcel](https://parceljs.org/)でサイトを構築していたのだけれど、かなりツラミが出てきたので、別のツールに移行することを数日前に決心し、実行した（[ybiquitous/homepage#515](https://github.com/ybiquitous/homepage/pull/515)）。

## ツラミ

- [Parcel 2](https://v2.parceljs.org/)への移行が思ったよりも簡単にいかない。
- Parcel 1が古いPostCSSに依存しているため、GitHub security alertsがうるさい。
- Markdown周りで柔軟性がない。
  - Parcelはbuilt-inの[`MarkdownAsset`](https://github.com/parcel-bundler/parcel/blob/e11f0852e30fdac9ecae22398d1cf232b5eab9a2/packages/core/parcel-bundler/src/assets/MarkdownAsset.js)をもっているのだけれど、シンタックスハイライトをサポートしてなかった。
    なので、結局カスタムの[`MarkdownAsset`](https://github.com/ybiquitous/homepage/blob/9d2b2fef06ad4f6af101a3205d4d24bef8af6788/src/parcel/plugin-markdown/asset.js)を自作した。
  - サイトのコンテンツはブログがメインだから、カスタマイズが効かないのはちょっとツラかった。

まあ、ゼロコンフィグを謳うだけあって、柔軟性がないのは仕方ない面もある。

## 移行先候補：Snowpack

[Snowpack](https://www.snowpack.dev/)は以前から良さそうと思っていた。特にES Modulesを全面的に使うというのが面白そうだなーと。
（このサイトはモダンブラウザのみを対象とする、という思想で構築しているので、けっこう新しめの技術をpolyfillとか考えずに使うことにしている）

ただ、やっぱりCSSとかアセット周り、それにMarkdown変換とかはまだ弱そうだなという印象があり、APIドキュメント（下手したらソース）を読み込んでプラグイン書く羽目になるんだろうなーと思うと、怯んでしまった。

## 移行先：Webpack

ということで、結局移行先は[Webpack](https://webpack.js.org/)に落ち着いた。長年仕事でも使ってるし、十分に枯れてるし。Webpack 5リリースからしばらく経って安定性も増してるし。
（またメジャーバージョンアップで互換性が壊れて半年間くらいアップデートできなくなるかもしれないけれど）

Markdown周りは[`remark-loader`](https://github.com/webpack-contrib/remark-loader)という公式プラグインで対応できた。
[remark](https://github.com/remarkjs/remark)には仕事やOSSで慣れていたので、比較的すんなりと使えた。

Parcelのときは[marked](https://github.com/markedjs/marked)を使っていたのだけれど（`MarkdownAsset`）、柔軟性では圧倒的にremarkが上。
なぜなら、markedは正規表現ベースだけど、remarkはASTベースだから。

ただ、remarkは依存ライブラリをめちゃくちゃもってて、ソースコードを追うのが非常にしんどい。つまり、学習コストが高い。
その点、markedはゼロ依存でコードは断然追いやすい。このサイトを構築した当初（2019年）はremarkのことあまり知らなかったから、markedを選択したのはそういう理由がある。
（当時はASTのこともよく分かってなかった）

## Markdown

Markdown周りは非常に悩んでいた。特に、ブラウザ上でMarkdown→HTMLに変換するのか、事前に変換してバンドルしておくのか。
これによってモジュールバンドラーの選択（プラグイン提供の有無、APIの柔軟性など）が変わる。

ブラウザ上で変換する場合、

メリット：

- バンドラーに依存しない。ES modulesだけでできる。

デメリット：

- JSのバンドルサイズは大きくなる。変換器＋シンタックスハイライター。特に、シンタックスハイライターは大概重い。
 - サイズを減らすためにコード分割（Code Splitting）を使う方法もあるけど、当然コードは複雑になる。
- レンダリングのチラつきが発生することが予測された（許容範囲かもしれないが）。

バンドラーに依存しないというメリットは大きくて、式年遷宮（Parcel→Webpackのように）をそう頻繁にやってられないよなぁという思いが強かったので、真剣に検討していた。

しかし、Webpackに移行すると決めて`remark-loader`の存在に気づいてからは（それまで使ったことがなかった）、バンドラーの方が楽じゃんと思うようになってしまった。
このWebpackロックインという判断がどう転ぶかは、時間が経ってみないとわからない。

## その他の設定

ここは簡単に。[`webpack.config.js`](https://github.com/ybiquitous/homepage/blob/5e34a5490a10eb96ef4a82a98d96612865a37779/webpack.config.js)と[`package.json`](https://github.com/ybiquitous/homepage/blob/5e34a5490a10eb96ef4a82a98d96612865a37779/package.json)を参照。
（`package.json` にはBabelとかPostCSSの設定がある）

- トランスパイラはBabel。TypeScriptは型チェックのみ。
- PostCSSを引き続き使用。Sassは使ってない。
- productionモードはCSSファイルを出力。
- developmentモードではDev Serverを使用。

…やっぱりWebpackの設定は知識ないとめんどくさい。web上には古い情報も転がってるし。ゼロコンフィグに惹かれる気持ちはわかる。

## モジュールバンドラー

個人的には、「モジュールバンドラー（Module Bundler）」というものは必要悪であって、ES Modulesがもっとカジュアルにブラウザで使えるようになるはずの未来では不要になると信じている。
（Snowpackはそういう未来を先取りしているという印象）

フロントエンドの技術変遷は、一時期よりだいぶ落ち着いてきたとはいえ、やはりまだ目まぐるしいものがある。
同じツールを使っていてもメジャーバージョンアップで互換性が壊れたり、プラグインを含めたエコシステム・コミュニティが追随しきれずに疲弊してしまって、結果として移行が進まないということがよくある。

現状はWebpackが枯れているとは思うけれど、まだWebpack 4を使っていて、中々Webpack 5に移行できないというところは多いんじゃないか。

## メジャーバージョンアップの弊害

少し話は変わるけど、互換性が壊れるメジャーバージョンアップによってエコシステムが疲弊してしまう、という現象はまさに今、自分が直面している。

[PostCSS 8](https://github.com/postcss/postcss/releases/tag/8.0.0)が出てしばらく経つけれど、そのPostCSSにガッツリ依存しているstylelintは、まだPostCSS 7依存のままだ。
次のメジャーバージョンで対応を予定しているが（[stylelint/stylelint#5205](https://github.com/stylelint/stylelint/issues/5205)）、スムーズに進んでいるとは言えない。
（自分もcore teamメンバーとして積極的に関わっているつもりだが…）

最近PostCSS 7に[セキュリティ修正がバックポートされた](https://github.com/postcss/postcss/releases/tag/7.0.36)けど、そのリリースが出るまではstylelintを使っているがゆえにPostCSS 8にアップデートできず、それなりに困った人も多いはず。
実際に、それについてstylelintにissueが立てられてもいる（[stylelint/stylelint#5298](https://github.com/stylelint/stylelint/issues/5298)）。

一方で、メンテナの立場からすると、ある程度互換性を壊してでもコードをメンテしやすい形にしないと持続的なメンテナンスができないのだろうし、ここは難しいところ。
極力依存を少なくするということがやはり原則として大事なのだろうけど、かと言って依存をなくして車輪の再発明をするのも中々苦しい。
JSはビルトイン関数が少ない＆標準ライブラリが少ないので、どうしても依存が増える傾向にある。

stylelintでも最近やっとlodash依存を消した（[stylelint/stylelint#4412](https://github.com/stylelint/stylelint/issues/4412)）のだけれども、完全にネイティブに置き換えられたわけではなく、いくつかのもっと小さなユーティリティライブラリを代わりに追加する必要があった。

依存ライブラリの選定にあたっては、

- 他への依存がない
- メンテされている、または十分に枯れている
- TypeScript型定義を提供してる

などを考慮した。中々にハードルが高いよなぁ、と自分でも思う。メンテの動向は継続的に追っていかないといけないし。
jQueryやlodashをサクッと入れておしまい、ではないので、まあめんどくさい。

## まとめ

話が少し脱線してしまったが、まとめると、

- モジュールバンドラーの式年遷宮はめんどくさい
- やっぱりWebpackは枯れている

かな。

このサイトの規模でめんどくさく感じるんだから、ビジネスのコードとかで式年遷宮とか本当に悪夢だよなぁ…。
