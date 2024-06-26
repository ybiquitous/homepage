---
published: 2021-09-23T00:00:00.000Z
lastUpdated: 2021-09-27T16:00:00.000Z
author: Masafumi Koba
tags: ruby, rubykaigi
---

# RubyKaigi Takeout 2021 - #1

9月9-11日の日程で開催された[RubyKaigi Takeout 2021](https://rubykaigi.org/2021-takeout)に今年も参加してきたので、所感をつらつらと記していこうと思う（すでに2週間近く経ってしまった…）。
1つの投稿を長くしたくないので、複数回に分ける予定。

有志によるまとめ（以下）がいくつか上がっているので、このブログではまとめはしない。

- [RubyKaigi Takeout 2021 感想記事 - ruby-jp](https://scrapbox.io/ruby-jp/RubyKaigi_Takeout_2021_%E6%84%9F%E6%83%B3%E8%A8%98%E4%BA%8B)
- [RubyKaigi Takeout 2021のスライド（Day1）｜TechRacho by BPS株式会社](https://techracho.bpsinc.jp/hachi8833/2021_09_09/111519)

## Personal Kaigi’s History

1. [RubyKaigi 2018 @仙台](https://rubykaigi.org/2018)（初参加）
2. [RubyKaigi 2019 @福岡](https://rubykaigi.org/2019)
3. [~~RubyKaigi 2020 @松本~~](https://rubykaigi.org/2020)（コロナ禍により中止）
4. [RubyKaigi Takeout 2020](https://rubykaigi.org/2020-takeout)（初オンライン）
5. [RubyKaigi Takeout 2021](https://rubykaigi.org/2021-takeout)（**今回**）

今回で4回目の参加。改めて振り返ってみると、人との繋がりが徐々にできてきたんだなぁとしみじみ感じる。
元々仕事がきっかけで参加するようになったけど、今は仕事抜きで楽しみだもんなぁ。何か温もりを感じるカンファレンスだなと思う☺️

以降は、各セッションについて。本稿では型（というより静的型解析）の話をメインにする。初回参加のときからずっと追いかけてるトピックなので、今回も一番興味があったのがそこ。

## TypeProf for IDE: Enrich Dev-Experience without Annotations

[@mame](https://twitter.com/mametter)さんによる初日の[キーノートセッション](https://rubykaigi.org/2021-takeout/presentations/mametter.html)。今回一番注目していた。
VSCodeを使ったライブコーディングでかなりインパクトは強め。チャットがどよめいていた記憶がある。

セッション後、裏でTypeProf用のLanguage Serverを動かしてるんだろうな〜と予想しつつ実装を探してみたところ、`lsp-test` というブランチ内に見つけた。

<https://github.com/ruby/typeprof/blob/lsp-test/lib/typeprof/lsp.rb>

まだプルリクエストもなく、メインブランチにもマージされてないっぽい。
Emacs使いなので、[lsp-mode](https://emacs-lsp.github.io/lsp-mode/)で動くかな〜と思って試してみたけど、うまく動かせなかった。

[Steep](https://github.com/soutaro/steep)みたいに[language_server-protocol](https://github.com/mtsmfm/language_server-protocol-ruby) gemを使ってるのかなと予想したが、
TypeProfは標準ライブラリなので、3rd-party gemは使えないそうで、Socketを使って実装してた。このあたりの事情はKaigi中に[ruby-jp Slack](https://ruby-jp.github.io/)の#typesチャンネルで聞けた。

同様の理由で[parser](https://github.com/whitequark/parser) gemも使えないとのこと。IDEサポートを充実するには標準ライブラリのRipperだと現状物足りないところがあるらしく、パーサをどうにかしたいという意向があるっぽい。
ちなみに、標準ライブラリではないSteepにはこのあたりの制約がない。

`if $0 == __FILE__ ... end` をファイル末尾に追加するのはちょっと抵抗があるが、このあたりは今後改善されていくことを期待。

TypeProf Language Server がリリースされたら、もう1回Emacsでチャレンジしたい。

## The newsletter of RBS updates

2日目、[@pocke](https://twitter.com/p_ck_)さんの[RBS近況報告](https://rubykaigi.org/2021-takeout/presentations/p_ck_.html)。
主に、新機能の `rbs collection` コマンドの話。

このコマンドが生まれた背景を簡単に説明すると、

- 3rd-party gemsのRBSを集積した[ruby/gem_rbs_collection](https://github.com/ruby/gem_rbs_collection)というリポジトリがある
- このリポジトリ上のRBSをダウンロードしたい場合、現状だと `git submodule` が推奨されてるけど、まあ不便だよね
- これらのRBSを管理するためのツールとして `rbs collection` コマンドが追加された

といったもの。

よくruby/gem_rbs_collectionの引き合いに出されるのがTypeScriptの[DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)リポジトリで、こちらも趣旨は同様だけど、型定義は `@types/***` というnpmパッケージで提供されている。
RBSも同様にgemで提供するのかな…と考えてたけど、そういう方針は採らずに `gem collection` コマンドが新規に追加された。gemで提供しなかった理由は質問しておけばよかったかも。

以下のドキュメントが参考資料：

- [`rbs collection` のドキュメント](https://github.com/ruby/rbs/blob/2713b948071eb313a7e9871d74ed0894d68712c0/docs/collection.md)
- [ruby/gem_rbs_collection のREADME](https://github.com/ruby/gem_rbs_collection/blob/617bf1033baf96887e76cafd6dd88340a8006b54/README.md)

その後、[Steepと `rbs collection` との連携](https://github.com/soutaro/steep/pull/420)ができるようになったので（未リリース）、会社のリポジトリで試そうとしたけどうまくいかなかったので、Steepに[issue](https://github.com/soutaro/steep/issues/432)を立てておいた。
すぐに@pockeさんから返信があったので助かった。`gem collection` はまだ成熟してないので、どんどん使ってフィードバックしていきたい。

## Ruby Committers vs the World

<https://www.youtube.com/watch?v=zQnN1pqK4FQ>

恒例の[vs the World](https://rubykaigi.org/2021-takeout/presentations/rubylangorg.html)でも、[@soutaro](https://twitter.com/soutaro)さんからRBSのアップデートの話があった。
YouTube動画では[4:00](https://www.youtube.com/watch?v=zQnN1pqK4FQ&t=240s)くらいから。

また、LSP絡みでパーサを良くしたいという話も@mameさんからあった。動画では[12:00](https://www.youtube.com/watch?v=zQnN1pqK4FQ&t=720s)くらいから。
けっこう議論が白熱してて面白かった。以下、一例。

- parser gemをバンドルする？Ripperどうする？
- [`parse.y`](https://github.com/ruby/ruby/blob/e6118c8108b6233615618ba1d048336ef83c6ff6/parse.y) をメンテしやすく書き換える？

## Matz Keynote

最終日のMatzによる[キーノート](https://rubykaigi.org/2021-takeout/presentations/yukihiro_matz.html)で軽く型の話に触れていたので紹介。
YouTube動画では[4:00](https://youtu.be/QQASprf5EGw?t=240)くらいから。

## Typing History on RubyKaigi

本稿を書いてて、どのくらい前からRubyKaigiで型の話が出てきたのかふと疑問に思ったので、調べてみた。
（もしかしたら、漏れがあるかもしれないが…）

### RubyKaigi 2016

- [Ruby3 Typing](https://rubykaigi.org/2016/presentations/yukihiro_matz.html)
  - Matzキーノート。“Ruby3 Typing” と題し、セッションを通じて型の話をしている。
  - Duck Typing を生かしつつ、どうやって型を導入していくかのビジョンを語っており、今聞いても面白い。
  - 「プログラミングを楽しくする」という目的は一貫して語られていて、動的↔静的の流行に流されないぞという強い意志を感じる。

その他に型の話をしているセッションは無かったと思う。

### RubyKaigi 2017

前年のMatzキーノートを踏まえてか、急に増えてきた。

- [Automated Type Contracts Generation for Ruby](https://rubykaigi.org/2017/presentations/rubymine.html)
  - JetBrainsの人のセッション。RBSやTypeProfの原型となるアイデアが垣間見える。
- [Type Checking Ruby Programs with Annotations](https://rubykaigi.org/2017/presentations/soutaro.html)
  - 現Rubyコミッタの@soutaroさんのセッション。Steep開発の経緯が語られている。
- [Ruby Language Server](https://rubykaigi.org/2017/presentations/mtsmfm.html)
  - language_server-protocol gem作者の[@mtsmfm](https://twitter.com/mtsmfm)さんのセッション。
    後にSteepでも使われることになるし、振り返ってみると感慨深いし先進性がある。
- [Writing Lint for Ruby](https://rubykaigi.org/2017/presentations/p_ck_.html)
  - 現Rubyコミッタの@pockeさんのセッション。型の話ではなくLinter(RuboCop)をどう実装するかの話だが、parser gemのことが出てきたり、色々と繋がっている。

### RubyKaigi 2018

この年から参加。Sorbet、Steep、TypeProf（まだ雛型）という実装が並び立った。

- [A practical type system for Ruby at Stripe.](https://rubykaigi.org/2018/presentations/DarkDimius.html)
  - Stripeが開発する型チェッカー、[Sorbet](https://sorbet.org/)の話。これも1つの衝撃だった。
- [Ruby Programming with Type Checking](https://rubykaigi.org/2018/presentations/soutaro.html)
  - 前年に引き続き、@soutaroさんによるSteepの話。
- [Type Profiler: An analysis to guess type signatures](https://rubykaigi.org/2018/presentations/mametter.html)
  - 現TypeProfの元となるアイデアが語られている、@mameさんのセッション。

（余談だけど、SorbetやRuboCopの作者の方々と飲む機会があったなぁ…。今考えると大変貴重な体験だった）

### RubyKaigi 2019

Ruby 3に向けて、型の話がさらに盛り上がる。

- [Ruby 3 Progress Report](https://rubykaigi.org/2019/presentations/matzbot.html)
  - Ruby 3で型シグネチャ（現RBS）とTypeProfの導入が表明された。
- [A Type-level Ruby Interpreter for Testing and Understanding](https://rubykaigi.org/2019/presentations/mametter.html)
  - 前年に引き続き、@mameさんによる現TypeProfのセッション。ちなみに、まだこの時点では *TypeProf* という名前はなかった。
- [State of Sorbet: A Type Checker for Ruby](https://rubykaigi.org/2019/presentations/jez.html)
  - 前年に引き続き、StripeチームによるSorbetの話。
- [The challenges behind Ruby type checking](https://rubykaigi.org/2019/presentations/soutaro.html)
  - @soutaroさんによる、現RBSとなるRuby型シグネチャの話。この時点ではまだRBSという名前も、ruby/rbsリポジトリも無かった。

### RubyKaigi 2020

Ruby 3リリースを年末に控え、だいぶ外枠が固まってきた感がある。

- [Type Profiler: a Progress Report of a Ruby 3 Type Analyzer](https://rubykaigi.org/2020-takeout/presentations/mametter.html)
  - @mameさんによる現TypeProfのセッション。まだTypeProfの名前はない。名前いつ決まったんだっけ。
- [Reflecting on Ruby Reflection for Rendering RBIs](https://rubykaigi.org/2020-takeout/presentations/paracycle.html)
  - Shopifyの人による、RBI（Sorbetが使う型シグネチャの一種）生成の話。`rbs prototype` コマンドを想起させる。
- [The State of Ruby 3 Typing](https://rubykaigi.org/2020-takeout/presentations/soutaro.html)
  - @soutaroさんによる、リリースを控えたRuby 3での型の話。RBSという名前は初出（のはず）。
- [Matz Keynote](https://rubykaigi.org/2020-takeout/presentations/yukihiro_matz.html)
  - Ruby 3の新機能の1つである、型の話が触れられている。

## Conclusion

（多分）2016年から始まって、静的型言語の流行（Go/Swift/TypeScript）やらIDE（VSCode）の発達やらで、型の話が加速していった印象がある。
今年のRubyKaigiでは、新しいdebug.gemでもVSCode連携の話が出ていたし、言語そのものの改善というよりは周辺ツールの改善に力を入れていこうという流れが出てきてる。

個人的な予測では、

- 著名gemのRBSが出揃う
- TypeProfなどLSPサポートが充実してくる

がトリガーとなって、この流れがより加速するんじゃないかと考えている。

さらに、型がある程度採用されるようになってツール周りも充実してくると、波及的にドキュメント周りの改善も進むのではないかと思う。
RBSというのは一種のAPIドキュメントでもあるので、RDocとの連携がどうなるのか興味深い。
ツールとしては別だが、IDEでの開発者体験という側面では、両者は不可分の関係にあると思う。

---

最後に、2016年からのKaigiの変遷を追ってきて改めて感じたこと。それは、こういう素晴らしいカンファレンスが定期的に開催されることによって、技術の発展に非常に大きな影響を及ぼすんだなと。
特に、過去の発表を全部YouTubeで見返すことができるというのは、本当にスゴイ。

運営の皆さん、こういう場を提供してくれて、本当にありがとうございます！

（気力と時間があれば、他のセッションについても書く予定）

## September 28 Postscript

[The newsletter of RBS updates](#the-newsletter-of-rbs-updates) のセクションに

> gemで提供しなかった理由は質問しておけばよかったかも

と書いたが、後日ruby-jp Slackの#typesチャンネルで質問を投げたところ、議論が意外と盛り上がったので追記しておく。
簡単にまとめると、次のとおり。

- 理想は `gem install @types/rails`
  - rubygems.orgにnamespaceを追加する改修が必要
    - Feature requestはすでにある [rubygems/rubygems.org#2258](https://github.com/rubygems/rubygems.org/issues/2258)
    - 誰が作る問題
  - namingで回避案 (e.g. `rbs-***`) は既存gemとの衝突を回避できないのでボツ
- 議論中にsource追加案（e.g `https://rbs.rubygems.org`）が出てきた
  - namespace追加するより、もしかしたら楽？
- 今は[git-cloneを使って](https://github.com/ruby/rbs/blob/ebfb3dbadc14fd787b51ee7ed6f73723cb1bc1f5/lib/rbs/collection/sources/git.rb#L105)実装してる
  - git-cloneで問題があるのはわかっているが、将来的に ruby/gem_rbs_collection がデカくなってどうしようもなくなる（遅いとか、GitHubに怒られるとか）までに何らかの対応はできるはず（時間は稼げる）

色んな人が参加して議論が拡がっていくのが面白かった。そして、当初の疑問を解消できた！😊

namespaceが実装されるまでgit-cloneで時間を稼ぐ、というアイデアがなんか[（良い意味での）技術的負債](https://t-wada.hatenablog.jp/entry/ward-explains-debt-metaphor)を想起させて、なるほどなぁと思ったことも付け加えておく。
