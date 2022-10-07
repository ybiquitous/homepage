---
published: 2022-09-20T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: ruby, rubykaigi
---

# RubyKaigi 2022

9月8日〜10日、[RubyKaigi 2022](https://rubykaigi.org/2022/)に参加した。今年は三重県津市で開催された。
3年ぶりのオフライン開催ということもあり、現地は大変盛り上がってたようだ。私は今年はリモート参加。

仕事の合間ですべてのセッションを視聴できたわけではないので、印象的だったセッションの感想を残す。

すべてのトークは後日[RubyKaigi YouTube チャンネル](https://www.youtube.com/channel/UCBSg5zH-VFJ42BGQFk4VH2A)にアップされると思うので、聞き逃したセッションは後で見直したい。便利な時代になった。毎度ながら運営チームに感謝👏

## [Ruby meets WebAssembly](https://rubykaigi.org/2022/presentations/kateinoigakukun.html)

[Ruby meets WebAssembly - Speaker Deck](https://speakerdeck.com/player/fbfddfe5eccb4700a3ae600b814a9ce9)

個人的には、今回のセッションの中で一番衝撃だった。

RubyとWasm（WebAssembly）についてはたしか去年あたりに最初に発表されたときも驚いた記憶があるが、今回のキーノートで実際にデモを見ることができて、今後への期待がさらに膨らんだ。

関連リンクはこちら👇

- [github.com/ruby/ruby.wasm](https://github.com/ruby/ruby.wasm) - ruby/ruby.wasm リポジトリ
- [irb-wasm.vercel.app](https://irb-wasm.vercel.app) - IRBをブラウザで実行できるWebアプリ
- [ruby-head-wasm-wasi](https://www.npmjs.com/package/ruby-head-wasm-wasi) - Ruby Wasmを同梱したnpmパッケージ

とりあえず、すぐに[サンプルリポジトリ](https://github.com/ybiquitous/ruby-wasm-playground)作って遊んでみた。

このサンプルリポジトリでは、Node.js上でRuby Wasmを実行している。サンプルコードはこんな感じ👇

```js
import { DefaultRubyVM } from "ruby-head-wasm-wasi/dist/node.cjs.js";

const binary = await fs.readFile(
  "./node_modules/ruby-head-wasm-wasi/dist/ruby.wasm"
);
const module = await WebAssembly.compile(binary);
const { vm } = await DefaultRubyVM(module);

vm.eval("puts 'Hello Ruby Wasm!'");
```

ブラウザで実行する場合は、[`fs.readFile()`](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback) を [`fetch()`](http://developer.mozilla.org/en-US/docs/Web/API/fetch) とかに置き換えることになる。つまり、ファイルシステムからではなくネットワークから `.wasm` ファイルを取得する。取得した `.wasm` ファイルのバイナリを [`WebAssembly.compile()`](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile) に食わせてコンパイルする、というのはどの環境でも変わらない。強いていうと、

```js
import rubyWasm from "./ruby.wasm"; // from file system
import rubyWasm from "https://some-wasm-hosting-server/ruby.wasm"; // from network
```

のように読み込めたら理想的かもしれないが（[JSON modules proposal](https://github.com/tc39/proposal-json-modules)のように）、今は大きな問題ではなさそう。

Ruby VMがWasmランタイムにロードできたら、`eval()` で任意のRubyコードを実行できる。

`.wasm` ファイルは大きくなりがちなので、ブラウザに配信するときの初期ロード時間がどうしてもかかる、という点は気になっている。標準ライブラリをどのくらい含めるかにもよるが、圧縮したしても少なくとも数MBはある。

ただ、これはWebアプリの性質とネットワークスピードによって許容範囲は変わるので、将来的には大した問題にならない可能性もある。初期ロード時間を重要視しないアプリには使えるし、より速いネットワークの規格が生まれたら自然と解決されるはず。

また、Web標準側でも、`.wasm` ファイルをより効率的に配信するための仕様が生まれるかもしれない。WasmランタイムをもったEdgeサーバーなどで実行される場合は、そもそも配信の問題は発生しないだろう。

ついでに、もともとWasmに対する理解が足りないなと感じていて、セッション後にたまたま見つけた[この記事](https://mixil.mixi.co.jp/people/12242)を読んでさらに理解が深まったのオススメする。「Wasm自体は、計算しかできない」という説明にナルホドと思った。

Ruby WasmはRuby 3.2にバンドルされるので、次のKaigiではWasm関連のセッションが増えると予想。とにかくWebAssemblyについて学びたくなってきた。

## [Adding Type Signatures into Ruby Docs](https://rubykaigi.org/2022/presentations/oceanicpanda.html)

[Adding Type Signatures into Ruby Docs - Speaker Deck](https://speakerdeck.com/player/a2b097dc2c5e4615a800a0786df76f97)

[rubyapi.org](https://rubyapi.org/) の作者のセッション。このAPIドキュメントサイトはかなり見やすい。普段は[Dash](https://kapeli.com/dash)というmacOSアプリでRubyのAPIを探すことが多く、Dash内部では [ruby-doc.org](https://ruby-doc.org/) が使われているのでそちらを見ることが多いが（[docs.ruby-lang.org](https://docs.ruby-lang.org/) はあんまり見ない）、この rubyapi.org は見やすく検索性に優れてるので、Dashでもこちらを採用してほしいなと思ったほど。

このドキュメントサイトRBSを連携させるという話で、たしかに型定義はドキュメントの側面をもっているので、RDocとRBSはうまく連携してほしいところ。

このセッションの後に、たまたまRougeというgemの[RBSシンタックスハイライトのフィーチャーリクエストissue](https://github.com/rouge-ruby/rouge/issues/1600)が立っていたの見つけた。このリクエストが実現すれば、ドキュメントがさらに見やすくなりそう。

あとは [github/linguist](https://github.com/github/linguist) もRBS対応してくれれば、GitHub上でRBSのシンタックスハイライトが実現されてみんな幸せになれそう。

（時間があれば自分で取り組んでみたいところ…）

## [RBS generation framework using Rack architecture](https://rubykaigi.org/2022/presentations/_ksss_.html)

[RBS generation framework using Rack architecture - Speaker Deck](https://speakerdeck.com/player/4d87c4ade696409aadf1e992971e60d4)

ブログは[こちら](https://ksss9.hatenablog.com/entry/2022/09/11/100155)。

[Orthoses](https://github.com/ksss/orthoses) というRBS生成のためのフレームワークの紹介。「orthosis（装具）」という単語の複数形を名前にしたらしい。初めて見た単語だった。
内部で `TracePoint` を使っていて、Orthoses APIを介してコードを実行すると、実行されたコードのRBSを出力できる。Rackライクなアーキテクチャを採用しているので、前処理・後処理をミドルウェアを足すように追加できる、利点をもつ。

既存ライブラリに以下にしてRBSを付与していくか、という問題を解決するための1つのアイデアと捉えた。これは、やはり既存のライブラリ資産（RubyGems）に対してRBSが圧倒的に足りておらず、型の恩恵を受けにくい、という現状認識から来たものと思われる。RBS（というより型定義）は書かれるより読まれる方が圧倒的に多いので、RBSを普及させていくにはRBSを書いてくれる人が必要だけどマンパワーが完全に足りてない。

[DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) に何度かコミットしたことがあるが、PR投げてからのフローはBotで大部分自動化されているし、いくらマイクロソフトといえども、ある程度のワークフローを自動化しないと運用できないんだろうなぁと邪推してしまう。

自動生成したコードと手動で書いたコードとでどうやって折り合いを付けるのか運用が難しそうだが、ある程度足場を固めてあげないとRBSの普及が進まないと思う。

ちなみに、この次のセッションも `TracePoint` を使ってRBSを自動生成する、という内容だった⬇️
[Let's collect type info during Ruby running and automaticall](https://rubykaigi.org/2022/presentations/pink_bangbi.html)

`TracePoint` すごい。

## [The Better RuboCop World to enjoy Ruby](https://rubykaigi.org/2022/presentations/nay3.html)

[The Better RuboCop World to enjoy Ruby - Speaker Deck](https://speakerdeck.com/player/1c05e4592a734bbdb47329ee5eb3b9cb)

RuboCopとの上手な付き合い方、の話だと自分は捉えた。RuboCopは非常に強力なツールなのだが、0/1 (bad/good) のCI的な価値観で運用してしまうと辛くなる、という考えにとても共感する。badとgoodの間にmaybe goodがある、とトークでは語られていた。たしかに。

RuboCopが引き起こす「ツラみ」はおそらくデフォルト設定の厳しさに多くを由来するんだろうなぁと思う一方で、じゃあ何がデフォルト設定として最適かというと、これは簡単に答えが出ない。

多くのリンターがそうしているように、最低限の推奨設定をデフォルトとすればそういったツラみは軽減できるかもしれないが、その代わりに役に立つルールを探し出して自分で有効に設定する必要がある。これは結構しんどい作業だ。したがって、ある種厳しめのデフォルト設定を提供しているRuboCop作者の設計判断も、自分で設定する手間を省いているという面で合理的だとは思う。

基本的にリンターの設定は opinionated なものにならざるを得ないと思っているので、思考停止してデフォルト設定に従うという選択肢をとらないのであれば、プロジェクトやチームや文化などのコンテキストを考慮して、設定を調整するのは避けられないのではないかなと思っている。ツールを有効活用するのであればなおさら。

個人的には、なぜあるコードがRuboCopルール違反となっているか、チームで勉強会を開くのが良いと思っている。OSSのコードを読む機会にもなるし、RuboCopのような静的解析ツールの限界も知ることができれば、より建設的なツールとの付き合い方できるようになるかもしれない。なにより、よりRubyについて深く学べる契機となりうる。

## その他

「Commiters vs The World」にてShopifyチームがRubyパーサ（`parse.y` ？）を書き直すみたいなことを言ってたけど、このツイートかな👇

[Kevin Newton on Twitter: "Since @yukihiro_matz mentioned it on stage at #rubykaigi... Yes! I'm going to be rewriting the Ruby parser. I'm super super excited about this, and you should be too! Below is a brief thread about how and why, but tl;dr: portability, error tolerance, and maintainability." / Twitter](https://twitter.com/kddnewton/status/1568316056208547840)

昨年のKaigiで、たしか今のパーサだとVSCode拡張のようなIDE連携に不十分、みたいな話があった記憶があり、Shopifyが本腰入れて取り組むという話になっているぽい。Ruby 3以降の開発者体験強化の流れから、やはり本丸に取り組み必要があるのかな。「あんまり期待しないで」的なことを言ってた気もするけど、やはり俄然Shopifyを応援したい👏

それ以外だと、型（RBS）の話がかなり増えたのが印象的だった。あと、RuboCop関連のセッションも2つ。開発者体験への関心が大きくなっているのを感じる。
（ところで、型の話でSorbetが一切出てこないのなんでだろう…Shopifyも使ってるはずなんだけどな）

## Next Kaigi

次回は**長野県松本市**とのこと。2年前のコロナキャンセルに対するリベンジ開催の雰囲気を感じる。

[RubyKaigi on Twitter: "RubyKaigi 2023: May 11-13, 2023; See you in Matsumoto! #rubykaigi" / Twitter](https://twitter.com/rubykaigi/status/1568517449812946946)

まだ行けるかわからないから、運営スタッフの皆さんは大変だろうけど、オンライン併用も継続してほしいな…。
