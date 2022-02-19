# Font Awesome 6でBabelマクロを使う

ふと今日思い立って、このサイトで利用している[Font Awesome](https://fontawesome.com)というアイコンライブラリをバージョン5から6にアップデートした。
その際、新しいビルドの仕組み（**Babelマクロ**）が導入されていたので、勉強がてらやってみた。当記事はその備忘録である。

## アップデートは簡単だった

まず、アップデート自体は `package.json` を更新するだけで[サクッと完了した](https://github.com/ybiquitous/homepage/pull/767)。今回コードの変更は特に必要なかった。
（環境によっては非互換が発生するかもしれないので、アップグレードガイドには目を通しておくことをお勧めする）

ちなみに、Font Awesome 6は[今月リリースされたばかり](https://blog.fontawesome.com/font-awesome-6-2/)。なんかベータの期間が長かったような記憶がうっすらとある。

## 新しいビルド方法を見つける

そもそも、以前からFont Awesomeのバンドルサイズが気にはなっていた。未使用のアイコンもバンドルされる問題があるのだ。
このサイトくらいであれば使っているアイコン数が知れているので大した影響は無いが、サイトが大きくなってくるとJSバンドルサイズのパフォーマンスへの影響が無視できなくなってくる。

本サイトではReact経由でFont Awesomeを使用しているので、SVGアイコンがJSに埋め込まれてブラウザに送られる。

アップデートがてら、新しくなったFont Awesomeのドキュメントを読んでいると、[Dynamic Icon Importing](https://fontawesome.com/docs/web/use-with/react/add-icons#dynamic-icon-importing) という箇所を見つけた。
どうも、ビルド時に未使用のアイコンを除去してくれるらしい。それもTree Shakingに依存しないように。
まず `babel-plugin-macros` をインストールしろと書かれているが、そもそもこのBabelプラグインのことをよく知らなかった。

## babel-plugin-macrosとは

リポジトリは [github.com/kentcdodds/babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) だが、公式Babelブログに[紹介記事があった](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros)。2017年に書かれた記事なので、そこそこ前から作られている。

日本語だと[『作って理解するBabelマクロ』](https://blog.uhy.ooo/entry/2020-05-23/babel-macro/)というブログ記事がわかりやすかった。

既存のBabelプラグインもこのマクロプラグインも、コードをビルド時に書き換えるという点は同じである。では違いは何か？

- 既存プラグイン：
  - 暗黙的にソースコードすべてに適用される。一部のファイルを対象にできない。
  - プラグインを作るお作法が面倒。
- マクロプラグイン：
  - 明示的にインポートしたファイルにのみ適用される。
  - マクロプラグインさえ入れておけば、変換するためのコードは簡単に書ける。

「暗黙的」というのは、例えば `?.` 演算が以下のように変換されるのを見るとわかりやすいかもしれない。

```javascript
a?.b;
```

↓

```javascript
var _a;
(_a = a) === null || _a === void 0 ? void 0 : _a.b;
```

これは、[Playground](https://babeljs.io/repl)で確認できる。

一方マクロでは、明示的にマクロモジュールをインポートして使う。以下はFont Awesomeの例。

```javascript
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

solid("cake");
```

↓

```javascript
import { faCake as _faCake } from "@fortawesome/free-solid-svg-icons/faCake";
_faCake;
```

かいつまんで説明すると、マクロの方がより簡単にコード変換処理を書ける、ということ。ただし、明示的にインポートして使うので、`?.` 演算子のような構文の変換はできない。

では、実際のFont Awesome内部のマクロコードを見てみよう。現在、112行の単一ファイルだ。重要部分を抜粋する。

<https://github.com/FortAwesome/Font-Awesome/blob/0078392/js-packages/%40fortawesome/fontawesome-svg-core/import.macro.js#L41-L47>

```javascript
const iconName = nodePath.parentPath.node.arguments[0].value
const name = `fa${capitalize(camelCase(iconName))}`
const importFrom = `@fortawesome/${license}-${style}-svg-icons/${name}`

const importName = addNamed(nodePath, name, importFrom)

nodePath.parentPath.replaceWith(importName)
```

なんとなく、以下のような変換が行われると想像できる。

```diff
-import { faCake } from "@fortawesome/free-solid-svg-icons"
+import { faCake } from "@fortawesome/free-solid-svg-icons/faCake"
```

インポート対象を単一ファイルに変換しているので、Tree Shakingが効かない環境でも必要なファイルのみをバンドルできるコードになる。

## マクロでビルドしてみる

以下、簡単な手順を説明する。詳しくは上記Font Awesomeのドキュメントを参照のこと。
本サイトの[プルリクエスト](https://github.com/ybiquitous/homepage/pull/768)でもイメージがつかめるかもしれない。

1. `npm i babel-plugin-macros` でインストールする。
2. Babel設定ファイルに `plugins: ["macros"]` を追加する。
3. Babelマクロ設定ファイルを作り、`"fontawesome-svg-core": { license: "free" }` を追加する。Proライセンスの場合は `"pro"` を指定する。
   - ただし、この設定は `free` の場合は省略できるようになるかもしれない。そのための[プルリクエスト](https://github.com/FortAwesome/Font-Awesome/pull/18714)がオープンされている。
4. `import` およびアイコン名を書き換える。例えば、以下のような感じで。

```diff
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
-import { faCake } from "@fortawesome/free-solid-svg-icons";
+import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

-FontAwesomeIcon icon={faCake} />
+FontAwesomeIcon icon={solid("cake")} />
```

5. TypeScript環境では、型定義を追加する必要があった。[Issueが報告されていた](https://github.com/FortAwesome/Font-Awesome/issues/18616)ので、そのうち修正されるかもしれない。

```typescript
declare module "@fortawesome/fontawesome-svg-core/import.macro" {
  import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";

  export function brands(iconName: IconName): IconProp;
  export function solid(iconName: IconName): IconProp;
  export function reqular(iconName: IconName): IconProp;
}
```

あとは通常のBabelを使うフローのままで、変換処理が施されるようになる。

実は、本サイト環境ではプロダクションビルドのバンドルサイズはほぼ変わらなかった。従来の書き方（named import）でTree Shakingが効いていたことがその理由だ。
マクロの設定が入れたことで、逆に抽象度が増したとさえ言える。ただ、コードベースが大きくなってTree Shakingが上手く効かないケースでは有用だとおもう。
新規で始めるなら、最初からマクロで書いておいた方が恩恵が大きそうではある。

プロダクションビルドのサイズが変わらない場合でも、マクロを使えば開発ビルドのバンドルサイズを減らせるメリットがある。
開発ビルドではTree Shakingが有効にならないからだ（マクロ変換のオーバーヘッドはあるかもしれないが）。

デメリットは、既存コードの書き換えが必要なこと。コードの規模によっては、手動で変換するのは難しいだろう。簡単な変換ツールを書く必要がありそう。

## その他のマクロの使用例

### CSS-in-JS

CSS-in-JSライブラリの `styled-components` でも[Babelマクロが使われている](https://styled-components.com/docs/tooling#babel-macro)。

CSS-in-JSライブラリは実行時に `<style>` をDOMドキュメントに挿入するのでオーバーヘッドがあると思っていたが、ビルド時にマクロで変換すれば確かにオーバーヘッドはなくなる。
これはかなり有効な使い方だと思う。

### TypeScript

[`typecheck.macro`](https://github.com/vedantroy/typecheck.macro) というマクロは、TypeScriptの型定義にもとづいた実行時バリデータを生成してくれる。
[`zod`](https://github.com/colinhacks/zod)などのバリデータライブラリよりもパフォーマンスが良いとのこと。これも上手い使い方だと思う。

[awesome-babel-macros](https://github.com/jgierer12/awesome-babel-macros)というリポジトリには、他にもさまざまな例が紹介されている。

## まとめ

Font Awesomeアップデートに端を発して、Babelマクロについて学んだ。それまではBabelマクロを知らなかったが、用途によってはかなり使えそうなツールだということが分かった。

今後、CSS-in-JSやTypeScriptなど他のマクロを試してみたい。また、実際にマクロを書いてもみたい。
