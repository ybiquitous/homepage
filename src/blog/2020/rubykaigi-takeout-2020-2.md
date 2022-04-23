# RubyKaigi Takeout 2020に参加した（2）

[前回](./rubykaigi-takeout-2020.md)の続き。2日目。

すでにYouTubeに[すべてのセッションの動画](https://www.youtube.com/playlist?list=PLbFmgWm555yZeLpdOLhYwORIF9UjBAFHw)がアップされていた。

## Ruby Committers vs the World

2日目のオープニング。例のごとく、事前の質問にコミッタが回答するという形式をとっていた。
型の話をしていたような記憶がある。soutaroさんがコミッタになったという紹介があった。めでたい。

内容は正直ほとんど覚えていない…。

## Magic is organizing chaos

- <https://rubykaigi.org/2020-takeout/speakers#shugomaeda>
- <https://github.com/shugo/RubyKaigi2020>
- <https://youtu.be/QKiQiK7gSHQ>

[`Proc#using`](https://bugs.ruby-lang.org/issues/16461)を提案したという話。
[Refinements](http://ruby-doc.org/core/doc/syntax/refinements_rdoc.html)に関連する話で、正直サンプルコード以外でRefinementsを見たことがなかったので少し予習した。
簡単に言うと、あるスコープ内でmonkey patchingできる機能、といったところか。以下、例。
`using RubyKaigiFake` の前後で `RubyKaigi2020#location` が書き換わっている。

```ruby
class RubyKaigi2020
  def location
    "YouTube"
  end
end

module RubyKaigiFake
  refine RubyKaigi2020 do
    def location
      "Matsumoto"
    end
  end
end

puts RubyKaigi2020.new.location #=> "YouTube"
using RubyKaigiFake
puts RubyKaigi2020.new.location #=> "Matsumoto"
```

ドキュメントに

> You may activate refinements at top-level, and inside classes and modules. You may not activate refinements in method scope. Refinements are activated until the end of the current class or module definition, or until the end of the current file if used at the top-level.

とあるように、Refinementsのスコープは、トップレベルとクラス・モジュール内だけ。`Proc#using` はこのスコープをブロックに広げようという提案で、以下のようなDSLが実現できる。

```ruby
User.where { :name == 'matz' }
```

最初見たときは「？？？」となったが、`where` ブロック内で `#==` を書き換えている。スコープ内だけでのみ書き換えが適用されるので、安全だというわけだ。
かなりアグレッシブで面白いとは思うけど、いかんせんアグレッシブ過ぎて賛否が分かれているようだ。
もしDSLが提供されていたら使うけど、あんまり自分では書こうとは思わないかも。

## msgraph: Microsoft Graph API Client with Ruby

- <https://rubykaigi.org/2020-takeout/speakers#jimlock>
- <https://youtu.be/TrVhnrTPtoI>

jinroqさんが[msgraph](https://github.com/jinroq/msgraph)という[Microsoft Graph API](https://docs.microsoft.com/en-us/graph/use-the-api)クライアントのgemを書いた話。
[公式のgem](https://github.com/microsoftgraph/msgraph-sdk-ruby)がすでに開発がされていないため、自分で作った経緯や作るときの苦労について話していた。

公式のgemのコードがけっこう酷かったり、公式のコード生成ツールがRubyをサポートしていなかったり、APIの仕様（or 挙動）つかむのが大変だったりしたようだ。

話を聴いていて、ふと[Octokit.rb](https://github.com/octokit/octokit.rb)のことを思い出した。これはGitHub REST APIの公式クライアントgemなのだが、やはりというか、あまりメンテされていない感じなのだ。
（GitHubの中の人がマージ権をもっているらしいが、反応が遅く、担当の人も異動している感がある）

言語ごとにクライアント出したり、実際のAPIの仕様に追従したりが大変で、あんまりリソースが割けないんだろうなぁ、と思っている。

と思ってリポジトリを漁ってみたら、[octokit/octokit.rb#1157](https://github.com/octokit/octokit.rb/issues/1157)というissueを見つけた。タイトルは「Generating client code from the OpenAPI schema」。
[aws-sdk-ruby](https://github.com/aws/aws-sdk-ruby)みたいにコードの自動生成が目標なのか。まあそうだよな。

## Don't @ me! Instance Variable Performance in Ruby

- <https://rubykaigi.org/2020-takeout/speakers#tenderlove>
- <https://youtu.be/iDW93fAp2I8>

tenderloveさんのインスタンス変数に関するパフォーマンスの話。インスタンス変数がどうパフォーマンスに影響するか理解できなかったが、
GC Compactionのアルゴリズムの話がわかりやすくスライド（アニメーション付き）で説明されていた。
`jemalloc` とか `mprotect` とかのシステムコールの話がでていたが、自分にはちんぷんかんぷんだった。とにかくGCを速くしようとしている、という雑な理解にとどまった。

## Dependency Resolution with Standard Libraries

- <https://rubykaigi.org/2020-takeout/speakers#hsbt>
- <https://www.slideshare.net/hsbt/dependency-resolution-with-standard-libraries>
- <https://youtu.be/wvayhyTEL_k>

hsbtさんのRubygems、Bundlerに関するセッション。私なりの理解でまとめると、

- 標準ライブラリ（Standard Library）をgem化しようとしている（default gems）。
  - gem化することで、Rubyのバージョンアップを待たずにgemだけ更新することができる。
- RubygemsとBundlerを統合する話。
  - [rubygems/rubygems](https://github.com/rubygems/rubygems)リポジトリにBundlerは取り込まれたけど、まだ別のツールのまま。
  - 将来的には同じツールとして統合される予定。

そもそも「default gem」と「bundled gem」の違いもよくわかってなかった。以下にまとめてみる。

- Standard Library：Rubyに組み込まれているライブラリ。gem化されてないライブラリ。
  - 例：`pathname`
  - ruby/rubyにある。<https://github.com/ruby/ruby/blob/v2_7_1/ext/pathname/lib/pathname.rb>
  - rubygemsにない。<https://rubygems.org/gems/pathname> → 404 Not Found
- Default Gem: Rubyを動かすために必要なgem。アンインストールできない。
  - 例：`benchmark`
  - ruby/rubyにある。<https://github.com/ruby/ruby/blob/v2_7_1/lib/benchmark.rb>
  - rubygemsにもある。<https://rubygems.org/gems/benchmark>
- Bundled gem: Rubyをインストールすると入っているgem。Rubyを動かすのに必ずしも必要というわけではなく、アンインストール可能。
  - 例：`bundler`（Ruby 2.6より同梱）
  - ruby/rubyにない。
  - rubygemsにある。<https://rubygems.org/gems/bundler>

見通しがよくなった。標準ライブラリのgem化は、ruby/rubyという巨大リポジトリからライブラリを抽出することで、ruby/rubyのコードの管理をしやすくし、
また、ライブラリgemの管理もやりやすくするんだろう、きっと。

`Gemfile` にdefault gemsを追加することでライブラリの更新を随時受け取ることができ、かつ `Gemfile.lock` でバージョンが固定されるので環境依存の問題も減る。
こうやって調べてみると、めちゃくちゃ重要なことがわかった。むしろ、ここにリソース投下すべきなのでは…とも思ってしまう。

## Live coding: Grepping Ruby code like a boss

- <https://rubykaigi.org/2020-takeout/speakers#jonatas>
- <https://youtu.be/YczrZQC9aP8>

jonatasさんのASTをカジュアルに使ってRubyコードを検索（grep）する話。hsbtさんと同時刻だったので、後で配信を見直した。
[Fast](https://github.com/jonatas/fast)というgemを使ってライブコーディングしていた。
セッションタイトルから[Querly](https://github.com/soutaro/querly)を連想したが、Querlyが独自のパターン言語を提供するのに対し、
FastはRuboCopに影響されたASTパターンを使う。
Querlyの方がASTを知らない人向けに作られているので柔軟性に欠けたり、YAMLの制約を受けるのに対し、FastはASTを意識させるのでかなり複雑なこともできる代わりに学習コストが高い感じ。

3年ほど前から仕事でASTを扱うようになって知ったけど、世の中的に段々ASTがカジュアルになってきたのかなぁと感じる。
今後もっと、ASTを利用したコード自動生成・修正ツールが出現してくる気がする。

ちなみに、README内のリンクが壊れてたので[修正PR](https://github.com/jonatas/fast/pull/24)を出し、無事にマージされた。

## Keyword Arguments: Past, Present, and Future

- <https://rubykaigi.org/2020-takeout/speakers#jeremyevans0>
- <https://youtu.be/rxJRrccXRfg>

jeremyevansさんのKeyword Arguments（kwargs）の話。この件については、[Rails界隈で盛り上がった](https://discuss.rubyonrails.org/t/new-2-7-3-0-keyword-argument-pain-point/74980)のが記憶に新しい。
ちょっと疲れていて流しながら聴いていたので、kwargsのやばいコード例がたくさん紹介されていたことがぼんやりと記憶にある。

そういえば、[`Module#ruby2_keywords`](http://ruby-doc.org/core-2.7.1/Module.html#ruby2_keywords-method)がライブラリ内で書かれているのをたまに見るなぁ。
自分でこのメソッドを書く日が来るのだろうか…。

## Ruby3 and Beyond

- <https://rubykaigi.org/2020-takeout/speakers#yukihiro_matz>
- <https://youtu.be/wVrJZReHlM8>

今回は一番最後になった、matzさんのキーノート。Ruby3とRuby3以降のお話。
プログラミング言語の互換性を維持するのが大変なことを、他の言語の歴史を紹介しながら、強調していた。
Python3とか、PHP6とか、ECMAScript4とか…。

この業界で仕事していると、バズワードみたいなものが蔓延っていて無意識に流行に流されがちだけど、やっぱり10年・20年くらいのスパンで物事を考えるのが大事だよなぁと思う。

互換性を大事にしつつ、かといって流行に鈍感になるとあっという間にコミュニティが縮小していくという危機感もあるので、Rubyも進化していくと強調していた。
マルチコアとか非同期I/Oの話が出ており、Node.jsやECMAScriptの流行の影響を強く感じた。

以前はRubyに実行速度は求めない（開発速度＞実行速度）みたいなことを聴いた記憶があるけど（私自身もあまりRubyで速度を重視するプログラムは普段書かない）、
多言語で成功している良い部分は積極的に取り込んでいくのかな。

次に、型の話。mameさんやsoutaroさんの話を聴いていたので、あまり驚きはなかった。

それからパターンマッチングや右代入といった新しいシンタックスの話があった。

最後に、Ruby3以降の話として、支援ツールの話が出た。FormatterとかLanguage Server Protocol（LSP）とか。
このあたりはPrettierやVSCodeの影響があるのかなと感じた。LSPについては型の話の流れで自然に感じたけれど、
Formatterと聞いたときはかなりビックリした。というのも、Rubyは自由を重視する文化みたいなものがあると思っていて、
それに反するようなツールの一種であるFormatterが意外に感じられたから。

個人的にはPrettierやESLintみたいなFormatter/Linter系のツールは好きなのだが、その弊害も経験しているので、
Rubyの文化とあんまりマッチしないんだろうなぁと漠然と感じていた。例えば、RuboCopのデフォルト設定を嫌いな人は多い。
（結局のところ、好き・嫌いといった好みの問題に収斂しがちになる）

どういうカタチでFormatterが提供されることになるか、今後が非常に気になる。
RuboCopが準拠する[The Ruby Style Guide](https://rubystyle.guide/)との兼ね合いとか…。

<https://twitter.com/ybiquitous/status/1302161022246031362>

## 感想戦

ko1さんが主催してくれて、RubyKaigi終わった直後にZoomで感想戦が開催された。matzさん、mameさん、amatsudaさんとか、有名な人たちが結構いた。
基本的には開発者会議ラジオを聞く、みたいなスタンスだった（1日目のvs the worldのように）。時折、チャットで質問が飛んでいた。

内容はあんまり覚えてないけど、RuboCopのスタイルの話とかが出てたのが少し印象に残っている（先ほどのFormatterと関連して）。

## 最後に

松本に行けなくてすごく残念だったけど、オンラインだと逆にセッションに集中できるのではないかと思う。
人が大勢いるところで聴くよりも、静かなところで動画配信を聴く方が頭に入ってくる。

これは新たな発見だったので、今後オフラインが復活しても、現地でこの方法を取ると思う。生と動画を使い分けるイメージ。

良い忘れてた。amatsudaさんの最後の締めは、やはり生が良い。オーガナイザーの皆さん、お疲れさまでした。

次回は[三重県津市](https://goo.gl/maps/StCDFQAgJeJJftUVA)。行ったことないから行きたいなぁ。
