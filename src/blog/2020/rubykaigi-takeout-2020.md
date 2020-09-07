# RubyKaigi Takeout 2020に参加した

2020年9月の4日・5日（金・土）の2日間にわたってオンライン開催された[RubyKaigi Takeout 2020](https://rubykaigi.org/2020-takeout)に参加したので、その感想を書く。
今回はコロナの影響もあって初（？）のオンライン開催。すべてのセッションが[YouTubeでストリーミング配信](https://www.youtube.com/channel/UCBSg5zH-VFJ42BGQFk4VH2A)されていた。（後日個別のセッションを切り取った動画が改めて配信されるそう）

## 全体的な所感

目があまり良くないので、オンラインで配信される方がスライドは見やすいと感じた。あと、聞き逃してもすぐに戻って聞き直せるというのも便利だった。
見たいセッションの時間がかぶっても、すぐに聞き直せるし、チャット欄が盛り上がってたのも見てて面白かった。
ここらへんはオンラインの利点でもあるので、今後オフライン開催が復活しても動画配信があれば並行して使うかな〜と思う。

ただやはり、オフラインでのface-to-faceがないのは、かなり寂しかった。これは仕方ないことだが…。

## 1日目

### Ractor report

<https://rubykaigi.org/2020-takeout/speakers#ko1>

ささださんのRuby 3に向けての並行性改善の話。C言語・Ruby内部の話はよくわからないのでなんとなくだが、以下が記憶に残った。

- Guild → Ractor にリネームした（理由は失念）。
- スレッド安全性（thread-safety）を保証するためには、いろんなところでfreezeされたオブジェクトが必要になるとか。
- See [Feature #17100](https://bugs.ruby-lang.org/issues/17100)

[GIL; Global Interpreter Lock](https://en.wikipedia.org/wiki/Global_interpreter_lock)についてよく分かってなかったので改めて調べた。
Rubyはスレッド安全性を保証するためにGILという仕組みを使ってるので、この仕組みがボトルネックのマルチコアで動かす際のボトルネックになるという話だった。Ractorの詳細は勉強不足でイマイチ理解できなかったが、オブジェクトをスレッド間で安全に共有するためにはオブジェクトを不変（immutable）にする必要がある、という話だと思っている。

『Effective Java』とかに、しきりにスレッドセーフについてのルールが書かれていたことを思い出す。
ついにRubyでもimmutabilityを意識してプログラミングする時代が来るのか。Stringのimmutabilityの話も盛んに出るし、関数型言語でもimmutabilityの話は出るし、避けられないのかな、マルチコア時代では。

プログラミングをする上で考えることが増えるというのはあまりうれしくないと思うが、Rubyでも破壊的メソッドを使うかどうか（e.g. `chomp` or `chomp!`）をプログラマは意識するので仕方ないのかもしれない。
このあたりは互換性の話もあって、すごく難しい。

アプリケーションプログラマとしては直接Ractorを触ることはほとんどないと思うけど（実際、Rubyで `Thread` 使ったことがない）、Pumaとかのミドルウェア層で使われるようになるのかな。

### Type Profiler: a Progress Report of a Ruby 3 Type Analyzer

<https://rubykaigi.org/2020-takeout/speakers#mametter>
<https://www.slideshare.net/mametter/type-profiler-ambitious-type-inference-for-ruby-3-238384550>

まめさんの型に関する進捗の話。[ruby-jp](https://ruby-jp.slack.com)の#typesチャンネルでちょこちょこ回答してもらっていたこともあり、比較的すんなり頭に入った。
[Steep](https://github.com/soutaro/steep)は結構触っていたが、これを機に[Ruby Type Profiler](https://github.com/mame/ruby-type-profiler)のリポジトリも眺めてみた。
[`ruby/rbs`](https://github.com/ruby/rbs)リポジトリをGit submoduleで取り込んでいる。rbsはすでに[gem化](https://rubygems.org/gems/rbs)されてるのにそれを使わないのはなぜだろう…、とふと思った（最終的に使うだろうけど）。

記憶に残ったのは、以下の点。

- Type Profiler は[RBS](https://github.com/ruby/rbs)の自動生成ツール。精度はだいぶ上がってきた。
- Type Profiler の名前募集。こちらもリネームするみたい。Type Profilerは「プロファイル」というよりは既存のコードから型定義を生成するツールなので、「パフォーマンス・プロファイリング」のようなものを連想されるとちょっと違う。
- [Goodcheck](https://github.com/sider/goodcheck)がデモの例として上げられたので、ちょっとビックリした。
- RBSが提供されてない3rd-party gemがあると、まだ解析・生成に失敗するらしい（うろ覚え）。

`rbs prototype` というコマンドでもRBSの自動生成ができるけど、それとの位置づけはどうなるのだろうか。
`rbs prototype` は簡易版で、Type Profilerの精度が上がってきたらそちらを使うのかな。後者の方が難しいアルゴリズムを使ってると思われる。

[会社のコード](https://github.com/sider/runners)でRBS書いてて思うけど、RBSの手書きはやっぱりツライ。すでにコードベースが大きかったり、3rd-party gemのRBSを提供したかったりするケースでは特に。
それでも手書きはしばらくは減らないと思うので、

生成されたRBSを手書きで修正 → クラス構造やメソッドシグネチャの変更 → Type Profilerで自動更新 → 手書きで修正

みたいなループが現実の開発で待っているのかなと思う。型の話はけっこう大変だと思う（実装もそうだし、仕様を決めるのも）ので、長い目で見てる。

## On sending methods

<https://rubykaigi.org/2020-takeout/speakers#shyouhei>
<https://speakerdeck.com/shyouhei/on-sending-methods>

メソッド呼び出しのパフォーマンス改善（キャッシュヒット率の改善）の話。卜部さんのセッション初めて聞いた。
C言語ほとんどわからないのでぼんやり聞いてたが、スライドがわかりやすく作られていたので比較的理解ができたと思う（日本語だったから余計に）。
実はRuby 2.7に入っていると聞いて「おお！」と思ったが、Guild（Ractor）で全面的にキャッシュの仕組みが書き直されたみたいで、「おぅ…」となった。

パフォーマンス改善は難しい。

## Reflecting on Ruby Reflection for Rendering RBIs

<https://rubykaigi.org/2020-takeout/speakers#paracycle>

型チェッカの一つである[Sorbet](https://sorbet.org/)用のRBI（RBSとはまた別。ちょっとややこしい）生成ツール、[Tapioca](https://github.com/Shopify/tapioca)の話。
同時間帯のOpalセッションと迷ったが、型関連をウォッチしてきているのでこちらを選択。
しかし、Ruby界におけるShopifyの存在感すごいなぁ（いい話）。

ツールの話というよりは、RubyのReflection APIの話がメインだった記憶がある。Reflectionである程度の型情報が取れるので、そこからRBIファイルを生成できるが、素のAPIだとちょっと工夫をしないといけないところ幾つかあった、みたいな話だったと思う。

一介のアプリケーションプログラマなのであんまりReflectionを触ることはないが（DSLやメタプロは大概ライブラリやフレームワークが提供している）、へーこんな情報も取れるんだーと思った。
たしかにRubyのコアにはサブクラス一覧取る方法ないよなぁ。[ActiveSupportにはある](https://api.rubyonrails.org/classes/Class.html#method-i-subclasses)けど…。

## Goodbye fat gem

<https://rubykaigi.org/2020-takeout/speakers#ktou>
<https://www.clear-code.com/blog/2020/9/3.html>

すとうさんのfat gemに関するセッション。fat gemとは「ビルド済みバイナリー入りのgem」のこと。
ユーザにとって便利かと思いきや、メンテのコストが大変（最新のRubyに対応するとか）で、下手すりゃ古いバージョンのまま放置されることもありとか。
Windowsでの開発環境も整ってきたし、システムのライブラリを使えばよくて、gemに同梱する必要はない、という流れでfat gem廃止にしたいらしい。

そういえば、あんまり意識したことなかったなぁ。使ったことがあるかどうかもわからない…。
[`libv8`](https://github.com/rubyjs/libv8) gemとかはfat gemなのかな。

## Don't Wait For Me! Scalable Concurrency for Ruby 3!

<https://rubykaigi.org/2020-takeout/speakers#ioquatix>

Samuelさんの非同期I/Oに関するセッション。[Falcon](https://github.com/socketry/falcon)というHTTPサーバーのgemを紹介してた。
Rubyにおける非同期I/Oについてはあまり理解してないが、やはりNode.jsの成功に影響を受けているのだろうか。
[Unicorn](https://rubygems.org/gems/unicorn)→[Puma](https://github.com/puma/puma)に置き換わってきているように、将来はPuma→Falconになるのかな。
アプリケーション側で非同期I/O意識しないでプログラミングできればいいけど、Node.jsみたいにcallbackとかPromiseとかasync/awaitが必要になるのはちょっとイヤかなぁ。うまく隠蔽してくれるといいんだけど。
（最近のJavaScriptは、いたるところにasync/awaitが必要）
