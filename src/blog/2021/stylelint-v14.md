# Stylelint 14.0.0

*“[ビビッドガーデン Advent Calendar 2021](https://qiita.com/advent-calendar/2021/vivid-garden)” 3日目の記事*

2021年10月21日、[Stylelint 14.0.0](https://github.com/stylelint/stylelint/releases/tag/14.0.0) がリリースされた。
このバージョンは大きな破壊的変更を含むので、本稿ではその解説をする。

公式ドキュメント上ではバージョン14.0.0から、小文字の *stylelint* ではなく大文字始まりの **Stylelint** に統一するようにしたので、本稿でもそれに従う。
（参考: [stylelint/stylelint#5564](https://github.com/stylelint/stylelint/issues/5564)）

## ユーザ向けの変更

今回のバージョンには[マイグレーションガイド](https://stylelint.io/migration-guide/to-14)が用意されているので、先に軽く目を通してもらえると理解が早いかもしれない。

### シンタックス指定方法

最大の変更は、`syntax` オプションとシンタックス自動類推機能の削除だろう。今までStylelintはファイルの拡張子などからCSSかSCSSかといったシンタックスを自動で類推していた。
つまり、以下のようにStylelintがよしなに判別してくれていた。

`a.css`:

```css
a {} /* これはCSS */
```

`a.scss`:

```scss
a {} // これはSCSS
```

Stylelint 13:

```console
$ stylelint "**/*.{css,scss}"

a.css
 1:3  ✖  Unexpected empty block   block-no-empty

a.scss
 1:3  ✖  Unexpected empty block   block-no-empty
```

Stylelint 14:

```console
$ stylelint "**/*.{css,scss}"
/tmp/stylelint-demo/a.scss: When linting something other than CSS, you should install an appropriate syntax, e.g. "postcss-scss", and use the "customSyntax" option

a.css
 1:3  ✖  Unexpected empty block  block-no-empty

a.scss
 1:6  ✖  Unknown word  CssSyntaxError
```

Stylelint 14でそのままSCSSファイルを解析すると、シンタックスエラーが発生する。これを解決するには、新たに追加された `customSyntax` オプションを指定する必要がある。
また、明示的に `postcss-scss` パッケージをインストールする必要もある。

`.stylelintrc.json`:

```diff
{
+ "customSyntax": "postcss-scss",
  "rules": {
    "block-no-empty": true
  }
}
```

`package.json`:

```diff
{
  "dependencies": {
+   "postcss-scss": "^4.0.2",
    "stylelint": "^14.1.0"
  }
}
```

これでSCSSファイルの解析が成功するようになる。

```console
$ stylelint "**/*.{css,scss}"

a.css
 1:3  ✖  Unexpected empty block  block-no-empty

a.scss
 1:3  ✖  Unexpected empty block  block-no-empty
```

このように、Stylelint 13まではシンタックス自動類推機能のために各シンタックス用のPostCSSプラグインを依存ライブラリとして含んでいたが、Stylelint 14からは含まなくなった。
そのため、ユーザが自分でプラグインをインストールし、シンタックスを指定する必要がある。

ただ、これではほとんどのユーザは不便になったと感じるだろう。その不満を解消するには、コミュニティが用意している**共有設定**を使えばよい。

`.stylelintrc.json`:

```diff
{
+ "extends": "stylelint-config-recommended-scss",
  "rules": {
    "block-no-empty": true
  }
}
```

`package.json`:

```diff
{
  "dependencies": {
    "stylelint": "^14.1.0",
+   "stylelint-config-recommended-scss": "^5.0.2"
  }
}
```

[`stylelint-config-recommended-scss`](https://github.com/stylelint-scss/stylelint-config-recommended-scss) をインストールすると、 `postcss-scss` が依存ライブラリとして自動でインストールされる。
また、`"customSyntax": "postcss-scss"` 設定も継承される。

SCSSのようにユーザベースの大きいシンタックスはコミュニティが提供してくれるが、その他のシンタックスでは共有設定が提供されてないので、自分で `customSyntax` を設定する必要がある。

#### `customSyntax` 導入の背景

大きな破壊的変更となった `customSyntax` オプションの導入は、PostCSS 8へのアップデート（[stylelint/stylelint#4942](https://github.com/stylelint/stylelint/issues/4942)）が発端となっていた。
（実装詳細にふれるので、このセクションは読み飛ばしてもらって構わない）

StylelintはPostCSSのエコシステムに強く依存しており、様々なPostCSSプラグインを使っているので、PostCSS 8へのアップデートもそのような依存プラグインがPostCSS 8に対応するのを待つ必要があった。
そのため、アップデート作業は各プラグインのメンテナの動向に強く依存する形となり、進捗があまり芳しくなかった。

特に、シンタックス自動類推機能は [`postcss-syntax`](https://github.com/gucong3000/postcss-syntax) というパッケージに依存しており、このパッケージメンテナの活動量が著しく低下していた。
（[`postcss-jsx`](https://github.com/gucong3000/postcss-jsx)、[`postcss-html`](https://github.com/gucong3000/postcss-html) なども同様）
SCSSやLessなどのシンタックスは随時アップデートされていくが、新しい機能に追随するためのPostCSSプラグインのメンテナンスが追いつかないという状況だった。

また、ほとんどのユーザにとって使われないシンタックスが自動でインストールされるのはセキュリティやパフォーマンスにも影響するし、Stylelintの実装もより複雑になりメンテナンスのコストが増大する。
（特定のシンタックスに関する issue も多いので、その管理も大変なのは言うまでもない）

[このコメント](https://github.com/stylelint/stylelint/issues/4942#issuecomment-839514125)に集約されているが、こうした様々な事情を背景に、コアをよりスリムにするという設計判断が下されたのだった。

### Node.js 10のサポート除外

Node.js 10は2021年4月にEOLになったので、サポートを除外した。よくあるやつ。

### 非推奨ルールの削除

blacklist/whitelist → disallowed-list/allowed-list のリネームで非推奨になっていたルールが削除された。

### `overrides` オプションの追加と `configOverrides` オプションの削除

`overrides` オプションが追加されたので、機能が重複する `configOverrides` オプションは削除された。
ESLintの [`overrides`](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns) オプションとほぼ同じやつ。
glob単位でルールの上書きができる。以下の例で何となくつかめると思う。

```json
{
  "rules": {
    "block-no-empty": true
  },
  "overrides": [
    {
      "files": ["**/*.scss"],
      "customSyntax": "postcss-scss"
    }
  ]
}
```

### `function-calc-no-invalid` ルールの削除

これは [stylelint/stylelint#4731](https://github.com/stylelint/stylelint/issues/4731) に詳しい理由が書かれているのだが、現状適切な `calc` 関数のパーサが無いというのが削除の理由だ。
残念ながら、今のところ代替手段が無い。

## プラグイン開発者向けの変更

Stylelintプラグイン開発者向けの変更点を説明する。

### PostCSS 8

“[シンタックス指定方法](#シンタックス指定方法)” セクションでも触れたが、Stylelint 14向けのプラグインではPostCSS 8に対応する必要がある。

### `disableFix` オプション

[`disableFix`](https://stylelint.io/user-guide/configure#disablefix) というオプションがコアに実装されたので、プラグイン開発者は独自に同様のオプションを提供する必要はなくなったというアナウンス。
[stylelint/stylelint#5431](https://github.com/stylelint/stylelint/issues/5431) 参照。

### TypeScript型定義の提供

Stylelint自体がTypeScript型定義を提供するようになったので、[`@types/stylelint`](https://www.npmjs.com/package/@types/stylelint) パッケージは不要になった。
[stylelint/stylelint#5580](https://github.com/stylelint/stylelint/issues/5580) 参照。

---

ここまで、バージョン14.0.0の変更点について書いてきた。以降のセクションでは、今回のバージョンに含まれなかったものや、今回のリリースに付随する特筆すべき話を書いていく。

## ESM対応

当初、ESM（ECMAScript Modules）対応もバージョン14.0.0に含めるという計画があった（[stylelint/stylelint#5291](https://github.com/stylelint/stylelint/issues/5291)）。
がしかし、すでにPostCSS 8対応で大きな遅延が発生していたので（StylelintのためにPostCSS 8にアップデートできない、というコミュニティからの圧力もあり）、次のメジャーバージョンでやることになった。
Pure ESMか、ESM/CJSのDual Packageでやるかは、まだ議論中。

## Stylelint SCSS Organization

`customSyntax` オプションの導入によって機運が高まり、[Stylelint SCSS](https://github.com/stylelint-scss)という GitHub Organization が誕生した。
[stylelint-scss/stylelint-scss#541](https://github.com/stylelint-scss/stylelint-scss/issues/541) に誕生の背景が書いてある。

以前は個人のリポジトリでSCSS関連パッケージが開発されていたが、より大きなスケールでコミュニティとして活動するようになった。
SCSSユーザはこれまで以上に安心してStylelintとSCSSを利用できると思う（もちろん、できれば貢献もしてほしい）。

## postcss-css-in-js

`@stylelint/postcss-css-in-js` パッケージを非推奨にしようという議論が立ち上がっている。これも `customSyntax` オプションの導入がトリガーとなっている。
[stylelint/postcss-css-in-js#225](https://github.com/stylelint/postcss-css-in-js/issues/225) を参照。

主な理由は、CSS-in-JSライブラリが増え続けている現状で、それらを統合するパッケージを提供するのは、リソース的に無理だということ。
これまでにコアリポジトリに立てられた、数多くのCSS-in-JS関連のissueがそれを物語っている（[stylelint/stylelint#4574](https://github.com/stylelint/stylelint/issues/4574)）。

まだ議論中なので決定ではないが、提案どおりに進めば、各CSS-in-JSライブラリ用のStylelintプラグインを各コミュニティや個人が作成する流れになると思う。

## postcss-html & postcss-markdown

“[`customSyntax` 導入の背景](#customsyntax-導入の背景)” セクションで触れたが、メンテが止まりかけていた以下のシンタックスパッケージを [@ota-meshi](https://github.com/ota-meshi) さんが引き受けてくれた。

- [`postcss-html`](https://github.com/ota-meshi/postcss-html)
- [`postcss-markdown`](https://github.com/ota-meshi/postcss-markdown)

こういう貢献ってなかなか目立たないかもしれないが、使ってるユーザからするとありがたいと思う。本当に称賛すべきこと。

## 個人的な話

最後に、個人的な話を。振り返ると、今回のバージョン14.0.0リリースは記憶に残るものだった。リリースまでの紆余曲折もあったし、そもそもリリースまでの期間が長かった。

個人としては、華々しい新機能を追加したとかの実績はなかったが、issue上の議論に参加したり、プルリクエストをレビューしたり、リファクタリングしたり、ライブラリをアップデートしたり…とかなり泥臭い作業をやっていたように記憶している。

もちろん、みんな他に仕事を抱えながらのOSS活動なので、なかなか進捗が出ない期間もあったし、単純に期間が長いから沢山コードを書いたとか新機能が沢山、ではないけれど。

このレベルの規模のプロジェクトにもなると（9.3K スター）、自分でコードを書くとよりも他の誰かに進んでコードを書いてもらえるようにすることに比重が移る。
そのためのインフラ作り（issue管理やドキュメント、CIの整備など）をしっかりとやっていくことが大事なんだと、改めて学んだ。

Stylelintコミュニティでは [@jeddy3](https://github.com/jeddy3) さんという方がリーダーシップをとってくれてるんだけど、そういうインフラ作りや議論のリーダーシップのとり方が抜群に上手いなぁと思う。
そういうコミュニケーションの部分では、言葉（英語）の壁をヒシヒシと感じる（学生時代、ちゃんと英語勉強しておけばよかった…）。

---

最後に、この記事を読んでStylelintに興味をもった方、[`good first issue`](https://github.com/stylelint/stylelint/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) ラベルのissueが貢献しやすいよ、と宣伝しておく。
