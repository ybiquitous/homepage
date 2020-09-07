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

## The State of Ruby 3 Typing

<https://rubykaigi.org/2020-takeout/speakers#soutaro>

同時間帯の「Road to RuboCop 1.0」と迷ったがこちらを選択。そうたろうさんの型の話。普段から情報収集してるせいか、あんまり新しい話はなかった気がする。現状の整理みたいな。
Ruby 3でのスコープが明確化されていて、RBS（型定義のための構文）とType Profiler（名前は変わるけど）はRubyコアで提供されることは確定っぽい。

型チェッカはいまのところ3rd-partyが提供するものだけとなる。SteepとかSorbetとか。あと一つ何か言ってたけど忘れてしまった…。
Ruby 3以降、公式の型チェッカを提供する予定があるのかどうかは気になるところだが、今はまだ決まってないのだろう。
型に対するコミュニティの反応や、3rd-party提供のチェッカがどの程度普及するかを見て、判断するのかなぁと思う。
（なんとなく、型に対する温度感は、コミュニティやコミッタの間でも差異がある気がする。なんとなくだけど）

個人的には型はほしいと思っているんだけど、チェッカやIDEなどの支援ツールが充実してこないと、コミュニティに普及するのは時間がかかるのかなぁと思っている。
（その点、TypeScriptのFlowtypeに対する勝利は、VSCodeの存在が大きい気がする）

例えば、型の存在はチェッカが通りやすいメソッドシグネチャをプログラマに書かせる力が働くと思うので、もしかしたらRubyの良さを消してしまいそうな懸念があるのかもしれない。
いずれにせよ、ほとんどのRubyプログラマが型の恩恵に与るには型チェッカが必要で、少なくともRuby 3の時点ではそれはユーザの選択に委ねられるので、なかなか普及という面では進まないかもしれず、長い目で見る必要があるかも。

逆に、メソッドシグネチャだけのユニットテストを不要にしたり、補完バシバシ効いたり、すぐAPIドキュメント見れたりと、開発体験が劇的に変わる可能性も秘めてるので、かなり期待している。
3rd-party gemの型定義どうする？みたいな問題もあるけど、実際に普及し始めたら一気にいくと思っている。TypeScriptがそうだったように。

## Road to RuboCop 1.0

<https://rubykaigi.org/2020-takeout/speakers#koic>
<https://speakerdeck.com/koic/road-to-rubocop-1-dot-0>

koicさんのRuboCop 1.0に向けた話。関心が高かったのですぐに見直した（YouTube便利）。
coreからいくつかcopを切り出した話（rubocop-railsとかrubocop-performanceとか）があったり、その過程でcherry-pickを積んでいくという気の遠くなる話があった。
本当にこういう方々の真心込めた手作業があって、普段ツールを使えてるんだなぁと思うと非常にありがたい。

RuboCop ASTの切り出しは比較的最近の話かと思うけど、[Reekからのリクエスト](https://github.com/troessner/reek/issues/1512)があったり、[ASTのnode patternだけ使いたい](https://github.com/rubocop-hq/rubocop/issues/6655)みたいなことが背景にあったのは知らなかった。
（よく見たらこの rubocop-hq/rubocop#6655 の起票者は2日目のスピーカーだった）
RuboCopは長い歴史があるから、そのコード解析エンジンの部分だけ使いたい、という気持ちはよく分かる。同じことをやろうとすると、結局車輪の再発明になるし。

ついに 1.0 か、と思うと色々と感慨深いものがある。
[Versioning Policy](https://docs.rubocop.org/rubocop/versioning.html)もきちっとして定めてあるし、ドキュメントの整備・Pending Copsの導入など着々と進んでいる気がする。年内にはリリースされるのだろうか。

（スライドの最後の乾杯写真、良かった。同席してた者として嬉しい）

## Ruby Committers vs the World

ちょっと疲れたので一つ飛ばして、1日目の最後のセッション、というか開発者会議ラジオを聴いた。
最初は事前に募集された質問にコミッタの方々が回答する、という体裁で始まったのだが、だんだん開発者会議化してコミッタがしゃべるのを視聴者はただ聴く、という形になった。
（YouTubeチャット欄は盛り上がってた）

これはこれで何か大きな会場で登壇されている人々の会話を聴くという以上の生々しさが感じられ（本当にラジオを聴いているかのよう）、1リスナーとして面白い体験だった。
個人的には、大きな会場で聴くよりも、このカタチの方が好きかもしれない。
（…内容は思い出せないw）

## 2日目

長くなったので、後日、別記事で書く。
