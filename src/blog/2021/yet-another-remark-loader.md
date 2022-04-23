# Webpack remark-loaderの代わりを作った話

つい先日、長い間懸案だった当サイトのremarkアップデートを完了したので、備忘録に残しておく。
PRはこちら 👉 [ybiquitous/homepage#675](https://github.com/ybiquitous/homepage/pull/675)

## Pure ESM

たしか、2021年4月に[Node.js v14.0.0](https://nodejs.org/en/blog/release/v14.0.0/)がリリースされてからだろうか、ESM（ECMAScript Modules）が公式サポートされるようになったので、npmパッケージのPure ESM化の流れが始まったように記憶している。

同時期だったかそれよりも前からだったか記憶が定かではないが、コミッタを務めるStylelintでも次のメジャーアップデートの話に付随してESM化のテーマが上がっていた。
その際、[Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)というガイドには随分お世話になった。
こうしたガイドやブログなどで徐々にPure ESMの認知度が上がってきたように思う。（ちなみに、ESMとCJS（CommonJS）の両方を提供することを、[Dual package](https://nodejs.org/api/packages.html#dual-commonjses-module-packages)と呼ぶ）

当サイトで、MarkdownをHTMLに変換するために利用している[remark](https://remark.js.org/)とそれに関連するパッケージも、この流れに乗って次々とPure ESMパッケージをリリースしていた。（See [remark 14.0.0 release note](https://github.com/remarkjs/remark/releases/tag/14.0.0)）

私はこのremarkをWebpackから扱うための[remark-loader](https://github.com/webpack-contrib/remark-loader)というパッケージを利用していたのだが、困ったことにWebpackのエコシステムはまだPure ESMをサポートしていなかった。2021年11月現在でもそうだ。サポートに大変な労力がかかることは、容易に想像できる。
remark-loaderがPure ESMのremarkに対応するのをしばらく待っていたのだが、なかなか進捗が無かったので、どうせなら自分でremark-loaderの代わりとなるものを実装しようと思い立った。

[ybiquitous/homepage#594](https://github.com/ybiquitous/homepage/pull/594)はremark-loaderのアップデートを待っていたが、ついにマージできなかったPRだ。

## unified & rehype

まずはremarkパッケージのアップデートから始めた。これは `npm outdated` コマンド古いパッケージを探し、`npm install` コマンドでアップデートしていくという、比較的簡単な作業だ。

ここで1つ異変に気づく。[remark-html](https://github.com/remarkjs/remark-html)というMarkdownをHTMLに変換する責務を負っているパッケージが非推奨となっているのだ。

READMEを読むと、[**rehype**](https://github.com/rehypejs/rehype) エコシステムを使え、と書いてある。
さらにリンクを辿っていくと、[unifiedjs.com](https://unifiedjs.com/)にたどり着いた。
以前からremarkを使っていて何となくunifiedのことは知っていたが、それらとrehypeの関係が最初はよく理解できなかった。

元々、remarkのエコシステムはパッケージが沢山あって、リポジトリも分散しており、それでいてドキュメントがあまりなかったから、敬遠していた。
今回unifiedjs.comを訪れてドキュメントが以前より充実していたので、理解を深めることができた。

簡単に書くと、次のような理解で良いかと思う。

- *unified* - 任意のテキスト変換処理を組み合わせための基盤となるプラグインシステム
- *remark* - Markdownテキストと[mdast](https://github.com/syntax-tree/mdast)（Markdown Abstract Syntax Tree）を変換する仕組み
- *rehype* - HTMLテキストと[hast](https://github.com/syntax-tree/hast)（HTML Abstract Syntax Tree）を変換する仕組み

サンプルコードを見ると、より直感的につかめるかもしれない（ストリームっぽいAPI）。

```js
const htmlText = await unified()
  .use(remarkParse)       // Markdown(text) → mdast
  .use(remarkRehype)      // mdast → hast
  .use(rehypeStringify)   // hast → HTML(text)
  .process(markdownText);
```

それぞれの変換器をunifiedがつなげるイメージだ。

各*astの実体は、プレーンなJavaScriptオブジェクト。このオブジェクトを普通のJSコードで読み書きすることで、変換処理が実現できる。

例えば、Markdown見出しのmdastはこんな感じ。

```js
// "# 見出し"
// ↓
{
  type: "heading",
  depth: 1,
  children: [{type: "text", value: "見出し"}]
}
```

HTMLリンクのhastの場合は、このようになる。

```js
// "<a href='https://github.com' class='link' download>GitHub</a>"
// ↓
{
  type: "element",
  tagName: "a",
  properties: {
    href: "https://github.com",
    className: ["link"],
    download: true
  },
  children: [{type: "text", value: "GitHub"}]
}
```

ただMarkdown→HTMLに変換するためだけのライブラリとしてremarkを考えていたので、unifiedやらrehypeやら覚える概念がやたらと増えて辟易したが、一度理解してしまうと「よくできてるなぁ」と感心してしまった。
何らかの構文（Syntax）をもつテキストは、すべてのこのエコシステム内で実装できてしまう、という非常に柔軟な仕組みになっている。
深くは見ていないが、現に自然言語（nlcst）やECMAScript（esast）のSyntax Treeがサポートされている。

## Write unified processor

仕組みを理解したので、あとはMarkdownを処理する `remark-*` パッケージをアップデートしていったり、HTMLを処理する `rehype-*` パッケージに置き換えていった。

[unifiedjs.com/explore](https://unifiedjs.com/explore/) ページでどんなパッケージがあるか簡単に探せるので、望む変換処理を実装したパッケージを見つけてインストールしていく。

さらに、それらを組み合わせて、独自のprocessorを実装していく。パッケージはほぼPure ESMで提供されているので、このprocessorモジュールもPure ESMで書く必要がある。

2021年11月現在の変換処理は次のようになっている。GFM（GitHub Flavored Markdown）へ変換したり、相対リンクに変換したり、`<h*>` タグにslugを付けたり、`<pre><code>` にシンタックスハイライトをかけたり…。
名前から想像できると思うが、柔軟に組み合わせることができるし、自分独自の変換も書ける。
HTMLのASTから最後に*stringify*してテキストに戻せば、変換は完了だ。

```js
const transformed = await unified()
  .use(remarkParse)
  .use(remarkRemoveH1)
  .use(remarkRelativeLink)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeToc, {
    headings: ["h2"],
    customizeTOC: (toc) => {
      return {
        type: "element",
        tagName: "details",
        properties: {
          class: "toc-wrapper",
        },
        children: [
          {
            type: "element",
            tagName: "summary",
            children: [{ type: "text", value: "Table of Contents" }],
          },
          toc,
        ],
      };
    },
  })
  .use(rehypeAutolinkHeadings, { behavior: "append" })
  .use(rehypeExternalLinks)
  .use(rehypeHighlight)
  .use(rehypeStringify)
  .process(source);
```

<https://github.com/ybiquitous/homepage/blob/74414eb84c6c83118d0207a84234c04b520411fa/src/remark/remark-loader.js#L19-L50>

例えば、以下は深さ1のMarkdown見出しを削除する独自変換の例。`visit()` というユーティリティパッケージが用意されており、Syntax Tree内を走査してマッチした要素に対して、任意の関数を実行できる。
`parent.children` というJS配列を書き換えることで、ASTを変更しているのが見てとれる。

```js
export default function remarkRemoveH1() {
  return (tree) => {
    visit(tree, { type: "heading", depth: 1 }, (_node, index, parent) => {
      if (parent && typeof index === "number") {
        parent.children.splice(index, 1);
      }
    });
  };
}
```

<https://github.com/ybiquitous/homepage/blob/74414eb84c6c83118d0207a84234c04b520411fa/src/remark/remark-remove-h1.js#L5-L13>

## Write Webpack loader

Markdown→HTMLの変換処理は書けた。あとはWebpackからloaderの仕組みで呼び出すだけ。remark-loaderを置き換えるloaderを書く必要がある。
もはや[html-loader](https://github.com/webpack-contrib/html-loader)は必要ない。

ここで1つ困ったことが起きた。WebpackからPure ESMのモジュールを呼べないのだ。
[Write a Loader](https://webpack.js.org/contribute/writing-a-loader/)というWebpackのドキュメントを読んでもわからない。
ここが1番悩んだポイントかもしれない。

loaderは比較的簡単に書けた。でもそれはPure ESMで書かれたunified processorを含んでいる、ESMモジュールだ。このように。

```js
import { unified } from "unified";

/** @type {import("webpack").LoaderDefinitionFunction} */
export default async function remarkLoader(source) {
  const transformed = await unified() // ...

  return `export default ${JSON.stringify(String(transformed))};`;
}
```

`webpack.config.js` では `module.rules[].use[]` に今回書いたloaderモジュールのパスを指定する。

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [path.resolve(__dirname, "./src/remark/remark-loader.js")],
      }
    ]
  }
}
```

しかしこれは動かない。おそらく [webpack/loader-runner#61](https://github.com/webpack/loader-runner/issues/61) に報告されている問題だと思う。
まだ、WebpackがESMで書かれたloaderに対応してない。

ツールを使って `remark-loader.js` (ESM) → `remark-loader.cjs` (CJS) に変換するか？と思ったが、importしているremarkパッケージたちはPure ESMだから、それらもCJSに変換する必要があり、現実的ではない。

何か手掛かりがないかNode.jsのドキュメントを漁っていたところ、[Dynamic `import()`](https://nodejs.org/api/esm.html#import-expressions)の箇所に行き着いた。
CJSモジュールからESMモジュールを呼び出すには、`import()` 関数を使うしかない。

- 🙅 Webpack → ESM
- 🙆 Webpack → CJS → ESM

やっとのことで、解決策を見つけた。ESMモジュールに `import()` 経由でブリッジするCJSモジュールを書けばいいのだ。
Webpack loaderはPromiseをサポートしているので、`import()` を使っても問題はない。ということで書いたモジュールがこちら。

```js
// remark-loader.cjs
module.exports = function remarkLoader(...args) {
  return import("./remark-loader.js").then((loader) => loader.default(...args));
};
```

<https://github.com/ybiquitous/homepage/blob/74414eb84c6c83118d0207a84234c04b520411fa/src/remark/remark-loader.cjs#L2-L4>

`webpack.config.js` で指定しているloaderへのパスも変更する。

```diff
{
  test: /\.md$/,
- use: [path.resolve(__dirname, "./src/remark/remark-loader.js")],
+ use: [path.resolve(__dirname, "./src/remark/remark-loader.cjs")],
}
```

これでうまくいった 🎉

## Conclusion

ESMとCJSの共存は本当にツライ。Pure ESMのパッケージが増えてきているが、CJSでしか動かないものはまだいくらでもあるし、まだ過渡期なんだから当分はDual packageでも良いんじゃない？と思う。ESMからCJSを出力するツールなんていっぱいあるんだし。

ただ、無理にでもPure ESM推進していかないと、なかなか移行が進まないんだろうなとも思うし、色々難しい事情があるんだろうな、きっと。
（ちょっと拙速すぎる感は否めなんだけど…）

とはいえ、ESMとCJSに関する知見は積めたし、なによりunifiedエコシステムが面白そうなことがわかったので、今回は非常に学びが多かった 😊
（unifiedは色んな可能性を秘めている気がしてる）
