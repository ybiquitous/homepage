# Font Awesome 6のビルドにbabel-plugin-macrosを使う

ふと今日思い立って、このサイトで利用している[Font Awesome](https://fontawesome.com)というアイコンライブラリを、バージョン5から6にアップデートした。
その際、新しいビルドの仕組みが導入されていたので、勉強がてらやってみた。当記事はその備忘録である。

## Font Awesomeのアップデート

アップデート自体は `package.json` を更新するだけで[サクッと完了した](https://github.com/ybiquitous/homepage/pull/767)。コードの変更は特に必要なかった。

Font Awesome 6は[今月リリースされたばかり](https://blog.fontawesome.com/font-awesome-6-2/)だった。なんかベータの期間が長かったような記憶がうっすらとある。

## Dynamic Icon Importing

そもそもの動機として、以前からFont Awesomeのバンドルサイズが気になってはいた。未使用のアイコンもJSバンドルされる問題があるのだ。
このサイトくらいであれば使っているアイコン数が知れているので大した影響は無いが、比較的サイトが大きくなってくると、JSバンドルサイズが馬鹿にならなくなってくる。

本サイトではReact経由で使用しているので、SVGアイコンがJSに埋め込まれてブラウザに送られる。

アップデートがてら、新しくなったFont Awesomeのドキュメントを読んでいると、[**Dynamic Icon Importing**](https://fontawesome.com/docs/web/use-with/react/add-icons#dynamic-icon-importing) という箇所を見つけた。どうも、未使用のアイコンを除去してくれるらしい。まず `babel-plugin-macros` をインストールしろと書かれているが、そもそもそのBabelプラグインのことをよく知らなかった。

## babel-plugin-macrosとは

リポジトリは [github.com/kentcdodds/babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) なので3rd-partyプラグインのようだが、Babel Blogに[紹介記事が投稿されていた](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros)。2017年に書かれた記事なので、そこそこ前から作られている。

日本語だと[『作って理解するBabelマクロ』](https://blog.uhy.ooo/entry/2020-05-23/babel-macro/)というブログ記事がわかりやすかった。

既存のBabelプラグインとこのマクロプラグインでは、コードをビルド時に書き換えるという点は同じである。違いを簡単に説明すると、次のことのようだ：

- 既存プラグイン
  - 暗黙的にソースコードすべてに適用される。一部のファイルを対象にできない。
  - プラグインを作るお作法が面倒。
- マクロプラグイン
  - インポートしたファイルにのみ適用される。
  - マクロプラグインさえ入れておけば、変換するためのコードは簡単に書ける。

要は、よりライトにBabelでコード変換書けると言うこと。社内リポジトリなど、特定の用途にサクッと使えそうな気がしている。

FontAwesomeのマクロは以下の場所にある。全部で112行の単一モジュールで書かれている。重要部分を抜粋してみる。

<https://github.com/FortAwesome/Font-Awesome/blob/0078392/js-packages/%40fortawesome/fontawesome-svg-core/import.macro.js#L41-L47>

```javascript
const iconName = nodePath.parentPath.node.arguments[0].value
const name = `fa${capitalize(camelCase(iconName))}`
const importFrom = `@fortawesome/${license}-${style}-svg-icons/${name}`

const importName = addNamed(nodePath, name, importFrom)

nodePath.parentPath.replaceWith(importName)
```

例えば、以下のような変換が行われると考えれば良い。インポート対象が単一ファイルになるので、Tree Shakingが効かない環境でも、必要なファイルのみがインポートされる。

```diff
-import { faCake } from "@fortawesome/free-solid-svg-icons"
+import { faCake } from "@fortawesome/free-solid-svg-icons/faCake"
```

## 使い方

簡単に書くとこんな感じ。詳しくは上記Font Awesomeのドキュメントを参照のこと。
本サイトの[プルリクエスト](https://github.com/ybiquitous/homepage/pull/768)でもイメージがつかめるかもしれない。

1. `npm i babel-plugin-macros` を実行する。
2. Babel設定に `plugins: ["macros"]` 追加する。
3. Babelマクロ設定に `"fontawesome-svg-core": { license: "free" }` 追加。Proライセンスの場合は `"pro"` を指定する。
   - ただし、この設定は `free` の場合は省略できるようになるかもしれない。そのための[プルリクエスト](https://github.com/FortAwesome/Font-Awesome/pull/18714)がオープンされている。
4. `import` およびアイコン名の書き換え。以下の例を参照。

```diff
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
-import { faCake } from "@fortawesome/free-solid-svg-icons";
+import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

-FontAwesomeIcon icon={faCake} />
+FontAwesomeIcon icon={solid("cake")} />
```

5. TypeScript環境では、以下の型定義を追加する必要がある。

```typescript
declare module "@fortawesome/fontawesome-svg-core/import.macro" {
  import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";

  export function brands(iconName: IconName): IconProp;
  export function solid(iconName: IconName): IconProp;
  export function reqular(iconName: IconName): IconProp;
}
```

実は、本サイト環境では、プロダクションビルドのバンドルサイズは変わらなかった。Tree Shakingが効いていたことがその理由だ。
基本的な使い方をするならば、マクロの設定が入る分、返ってめんどくさくなるかもしれない。

マクロを使うメリットは、開発ビルドであればバンドルサイズが確実に減る、というのがある。開発ビルドではTree Shakingが有効にならないからだ。
一定規模のプロジェクトでは、開発体験が良くなるかもしれない（コード変換のオーバヘッドもかかるが）。

デメリットは、コードの書き換えが必要なこと。コードの規模によっては、変換ツールを書く必要があるかもしれない。

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

Babelマクロを知らなかったが、かなり使えそうなツールだということが分かった。
今後CSS-in-JSやTypeScriptで実際に使ってみるかもしれない。
