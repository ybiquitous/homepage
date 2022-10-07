---
slug: 2020/example-of-type-checking-by-steep
title: Steepによる型チェックの実践例
published: 2020-12-21T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: ruby, rbs, steep, advent-calendar
---

# Steepによる型チェックの実践例

この記事は「[Ruby 3.0 Advent Calendar 2020](https://qiita.com/advent-calendar/2020/ruby3)」20日目の記事です。

昨日の記事はosyoさんの[「銀座Rails#28 で Ruby 3.0 の話をした」](https://secret-garden.hatenablog.com/entry/2020/12/20/000825)でした。

## 3行まとめ

- 中規模Rubyプロジェクトにおける、[Steep](https://github.com/soutaro/steep)による型チェックの実践例の紹介
- 工夫したこと
- メリット・デメリット

## この記事を読む前に

この記事を読む方は、おそらくRuby 3.0で型が導入されるという話はすでにご存知かと思います（Ruby 3.0 Advent Calendar 2020でも、いくつかの紹介記事があります）。
が、「Rubyに型？」や「RBS？TypeProf？Steep？ってなに？」という方は、以下の記事について目を通しておくことをオススメします。

- [The State of Ruby 3 Typing | Square Corner Blog](https://developer.squareup.com/blog/the-state-of-ruby-3-typing/)
- [Ruby 3の静的解析機能のRBS、TypeProf、Steep、Sorbetの関係についてのノート - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2020/12/09/120454)
- [Ruby 3 の静的解析ツール TypeProf の使い方 - クックパッド開発者ブログ](https://techlife.cookpad.com/entry/2020/12/09/120314)
- [rbs cli - pockestrap](https://pocke.hatenablog.com/entry/2020/06/15/081130)
- [RubyからRBSを生成する各方法の特徴 - pockestrap](https://pocke.hatenablog.com/entry/2020/12/18/230235)
- [Climbing Steep hills, or adopting Ruby 3 types with RBS — Martian Chronicles, Evil Martians’ team blog](https://evilmartians.com/chronicles/climbing-steep-hills-or-adopting-ruby-types)

特にRubyコミッターである[@mame](https://github.com/mame)さん（[TypeProf](https://github.com/ruby/typeprof)の作者）や[@soutaro](https://github.com/soutaro)さん（[Steep](https://github.com/soutaro/steep)の作者）の記事は一次情報にあたるので、非常にオススメです。

この記事ではRBSとSteepに焦点を当てます（Sorbetについては触れません）。また、理解を深めたい方は以下のGitHubリポジトリも眺めておくとよいと思います。

- [ruby/rbs: Type Signature for Ruby](https://github.com/ruby/rbs)
- [ruby/gem_rbs: A collection of RBS for gems.](https://github.com/ruby/gem_rbs)
- [soutaro/steep: Static type checker for Ruby](https://github.com/soutaro/steep)

## はじめに

最近になってようやく、Steepによる型チェックを会社の[Rubyリポジトリ](https://github.com/sider/runners)で実施するという目的を達成することができました（Railsではありません）。
構想自体は1年ほど前くらいからあったのですが、他に優先すべきことがあったり、RBSの仕様が固まっていなかったりなどで、なかなか進んでいませんでした。

がしかし、ここ数ヶ月ほどでRBSやSteepの完成度が高まってきたので、仕事がある程度落ち着いたこともあって、1週間ほど「えいやっ」と再開して完了させることができました。

リポジトリの規模は、コード行数は `lib/` 配下だけで8,700行ほどです（テストは含みません）。大きなライブラリ、といったところでしょうか。

もともとRBIといって `.rbi` ファイルに型を書くという仕組みがSteepに備わっており（RBSとしてRubyの仕様に取り込まれる以前）、そのRBIで書かれた資産が若干ありました。
が、すべてのメソッドやクラスをカバーしているわけではなく、新しいコードも日々生産されていくので、なかなか対応が難しくて後回しになっていました。

RBSのリポジトリ（ruby/rbs）が誕生したあたりから、型を自動生成するコマンドが追加されたりと周辺ツールが充実し始め、かつSteep自体の型チェックの精度も向上してきたおかげで、最近では当初あった苦労はかなり少なくなりました。

## TypeProfによる自動生成の目論見

Steepにおいては、ある程度の型ファイルは自動生成のひな型が利用できるのですが、やはり精度の高い型チェックを行うためには手で型ファイル（`.rbs`）を修正する必要があります。

そこで、TypeProfで型ファイルを生成できないかなと試してみたのですが、標準ライブラリやサードパーティgemのRBS型定義がまだ不十分であるため、自動生成は難しい状況でした。

やはり型ファイルの修正はめんどくさい作業ではあるので、RBS型定義の充実およびTypeProfの精度向上が、今後期待されます（夢の技術ですね）。

以下、工夫した点について列挙します。

## RBSファイル自動生成

まず、一旦既存の型定義を捨てて、あらたに `rbs prototype rb` コマンドで型ファイルを自動生成しました。ちょっと記憶が定かではないのですが、こんな感じの使い捨てRubyスクリプトを書いた記憶があります。

```ruby
# gen_rbs.rb
Dir.glob("lib/**/*.rb") do |rb_file|
  rbs_file = rb_file.sub(/lib/, "sig").sub(/\.rb$/, ".rbs")
  Pathname(rbs_file).parent.mkpath
  system "bundle exec rbs prototype rb #{rb_file} > #{rbs_file}", exception: true
  puts "#{rbs_file} generated."
end
```

このスクリプトを `bundle exec ruby gen_rbs.rb` のように実行すると、`lib/runners/cli.rb` → `sig/runners/cli.rbs` ファイルが生成されるイメージです。
（`rbs prototype` コマンドについては[@pocke](https://github.com/pocke)さんの[ブログ記事](https://pocke.hatenablog.com/entry/2020/12/18/230235)が詳しいです）

この方法は前述の[@palkan](https://github.com/palkan)さんの[ブログ記事](https://evilmartians.com/chronicles/climbing-steep-hills-or-adopting-ruby-types)でも紹介されていて、「やっぱり同じことしたいよなぁ」という感慨がありました。
（こちらの記事では以下のようにシェルスクリプトを使っていますね）

```bash
find lib -name \*.rb -print | cut -sd / -f 2- | xargs -I{} bash -c 'export file={}; export target=sig/$file; mkdir -p ${target%/*}; rbs prototype rb lib/$file > sig/${file/rb/rbs}'
```

どちらの方法も、1つのRubyファイルにつき1つのRBSファイルを対応させようとしたものです。別にRBSの書き方としてはそんな制約はないのですが、`.rb` ファイルがたくさんある場合は1対1に対応させたほうがわかりやすいかなと思ってそうしました。
（このあたりはプロジェクトの規模とかでも変わると思います）

## CIでのチェック

次に、CIでのSteepを実行してチェックするようにしました。GitHub Actionsを使っています。こんな感じです。
（一部抜粋ですが、[GitHub](https://github.com/sider/runners/blob/be6681594694e7505f5a3258ed6570024cb4f0d5/.github/workflows/steep.yml)で最新のものを確認できます）

```yaml
# .github/workflows/steep.yml
name: Steep

on: pull_request

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - run: |
          (bundle exec steep check | ruby -pe 'sub(/^(.+):(\d+):(\d+): (.+)$/, %q{::error file=\1,line=\2,col=\3::\4})') || echo 'done.'
        shell: bash
```

以下の2点を工夫しました。

- [GitHub check annotations](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#setting-an-error-message)でレポートする。
  - `ruby -pe 'sub(...)'` コマンドで、Steepの出力をcheck annotation用のフォーマットに変換してます。
- 失敗してもステータスはグリーンに。
  - `rbs prototype` で生成したRBSは不完全なため。

GitHub check annotationsを使うと、プルリクエストページのdiff上でエラーを確認できます（[例](https://github.com/sider/runners/pull/1725/files)）。
また、手動でRBSを修正し終わるまでは、プルリクエストをブロックしないようにしてます。

仕組みを作ったあとは、ひたすらRBSを修正していく作業になります。

## RBSを手動で直す

`rbs prototype` で生成したRBSにおいては、引数や戻り値、定数の型は `untyped` になるので、もう少し精度良くチェックしてほしいところです。つまり、ほとんどの作業は `untyped` の置き換えになります。

大体以下のようなフローです。

1. 定数の型を直す。例）`FOO: untyped` → `FOO: String`
2. メソッドの引数の型を直す。例）`def foo: (untyped num) -> untyped` → `def foo: (Integer num) -> untyped`
3. メソッドの戻り値の型を直す。例）`def foo: (Integer num) -> untyped` → `def foo: (Integer num) -> String`
4. `bundle exec steep check lib/foo.rb` を実行して、エラーがないか確認する。
   （私はEmacs使いなので使っていませんが、Steepの[VSCode拡張](https://marketplace.visualstudio.com/items?itemName=soutaro.steep-vscode)を使うと捗るかもしれません）
5. （1〜4の繰り返し）

大体1ファイル出来上がったらPRを出すようにしてました。1度1つのPRですべてのエラーをチェックしようとしたのですが、数が多すぎて心が折れました…。
これはプロジェクトの規模にもよると思うので一概には言えませんが、徐々にやることを私はオススメします。

それと、何よりRBSの構文を知ることが重要ですので（いくら直感的な構文とはいえ）、以下のドキュメントはよく参照していました。
<https://github.com/ruby/rbs/blob/b07243f0f5aef3dac3768881ff1f6b7e56aead9a/docs/syntax.md>

単純なケースだと問題にならないとは思うのですが、複雑な型を定義する場合は構文の理解度がかなり重要かなと思いますし、学習曲線のカーブが大きくなるポイントかなと思います。例えば、以下のようなケースです。

- ブロックを受け取る場合と受け取らない場合で、戻り値の型が異なる。
- 引数の数が多く、必須や任意などさまざま。
- `Array` や `Hash` が複雑。例）`Array[Hash[Symbol, String | Integer | bool | nil]]`

こればかりは慣れていくしかないのかなと思いますし、チームが大きくて学習のバラツキが大きいと最初は苦労するかもしれません。

## ポリフィル

一部の標準ライブラリやサードパーティgemの型はまだ提供されていないので、ポリフィル（Polyfill）を書かないとチェックが通らないです。

例えば `optparse` のポリフィルは[こんな感じ](https://github.com/sider/runners/blob/be6681594694e7505f5a3258ed6570024cb4f0d5/sig/optparse.rbs)です。

```ruby
# sig/optparse.rbs
class OptionParser
  attr_writer banner: String

  def initialize: { (OptionParser) -> void } -> void
  def on: (String, String) { (String) -> void } -> void
  def parse!: (Array[String]) -> void
end

class OptionParser::ParseError < RuntimeError
end

class OptionParser::MissingArgument < OptionParser::ParseError
end
```

自分のコードで使うメソッドだけを定義してますね。`rbs prototype runtime` コマンドを使って自動生成することもできます。

```console
$ bundle exec rbs prototype runtime -r optparse OptionParser
```

こちらは `OptionParser` クラスの全メソッドが出力されます。ケースバイケースで、手書きや自動生成を使い分けると良いと思います。

また、クラス定義はすでに提供されているが一部のメソッドだけ提供されてない場合は、[このように](https://github.com/sider/runners/blob/be6681594694e7505f5a3258ed6570024cb4f0d5/sig/time.rbs)一部のメソッドだけ書けばよいです。

```ruby
# sig/time.rbs
class Time
  def iso8601: () -> String
end
```

自分のリポジトリの `sig/` ディレクトリにこういったポリフィルRBSを放り込んでおくだけで、Steepはちゃんと認識してくれます。

`rbs` gemで提供されるようになれば、自分のポリフィルを削除するだけです。どのRBSが更新されたかをウォッチしておきたい場合は、`Gemfile` に以下のように明示しておくと良いと思います。

```ruby
# Gemfile
group :development do
  gem "rbs", require: false
  gem "steep", require: false
end
```

アップデートがあればDependabotなどのボットがPRを自動生成する、といった設定をしておくとよいでしょう。

## `untyped` との闘い

RBSファイルを修正していくにあたって注意しておきたいのは、**すべての `untyped` を撲滅することを目標にしない**、という点です。

いや、もちろんそこを目指す目指さないは自由なのですが、大体疲弊することになると思うので、ある程度折り合いをつけて100%を求めないことが大事だと考えます。

もちろん、RBSの型定義の提供はまだ不十分ですし、Steepでチェックできないケースもまだ存在する（新しめの構文は未サポートのものもあります）という事情もあります。

しかし、すべての型を記述したいという欲求が出てしまって、エラーチェックという本来の目的に不釣り合いな程の労力をかけてしまうのは、割に合わないでしょう。
そもそも、外部入力データは型が不明なケースが多いですし、あまり重要ではないが型を書くのが難しいケースもあります。
ポリフィルを書く場合も、最初は `untyped` でお手軽に書いておいて、あとでちゃんと公式のものに置き換えるといった運用で、労力を減らすことも可能です。

## インラインアノテーション

Steepは `@type var [name]: [type]` というコードコメントによるインラインアノテーションをサポートしています。型のヒントをRubyコードに書ける、という機能ですね。

```ruby
# @type var pkg: String
if pkg.match?(/-dev(=.+)?$/)
  return true
end
```

上記の例では `pkg` 変数の型が不明で `NoMethodError: type=⟘, method=match?` というエラーが発生していたので、それを抑制するためのアノテーションです。
数は多くはないですが、全く必要でなくなるケースはないかな…と感じています。メソッドシグネチャだけだと、どうしても型がわからないケースが出てくるので。

また、インラインアノテーションと少し違いますが、`_` へ代入することで `untyped` と見なし、エラーを回避するテクニックもあります。

```ruby
# `_` への代入で "NoMethodError: type=⟘, method=inspect" を回避する
(_ = path).inspect
```

どうしても、エラーの原因がわからなかったり、`# @type` を書くのが冗長な場面で使っています。

## `steep stas` の活用

徐々に進めていくと進捗がわからなくなってきたので、`steep stas` コマンドを途中から導入して、逐次確認するようにしました。
このコマンドの存在はなんとなく認知していたのですが、前述の@palkanさんの記事で賢い使い方を目にして、「なるほど！」と思い早速導入しました。

[`steep:stats`](https://github.com/sider/runners/blob/be6681594694e7505f5a3258ed6570024cb4f0d5/lib/tasks/steep/stats.rb)というRakeにしており、実行するとこんな感じで出力されます。
（`steep stats` はCSVを吐くので、シェルコマンドで整形してます。Windowsでは動かないでしょう）

```console
$ bundle exec rake steep:stats
bundle exec steep stats --log-level=fatal | column -s, -t | sort --key=7 --sort=numeric
Target  File                                           Status   Typed calls  Untyped calls  All calls  Typed %
lib     lib/runners/errors.rb                          success  0            0              0          0
lib     lib/runners/kotlin.rb                          success  0            0              0          0
lib     lib/runners/ruby/lockfile_parser.rb            success  2            5              7          28.57
lib     lib/runners/nodejs/constraint.rb               success  7            6              13         53.85
lib     lib/runners/processor/javasee.rb               success  47           29             76         61.84
lib     lib/runners/processor/phinder.rb               success  75           40             115        65.22
lib     lib/runners/analyzers.rb                       success  14           7              21         66.67
lib     lib/runners/processor/fxcop.rb                 success  36           18             54         66.67
(truncated...)
```

細かい数字は置いておいて、「あっこのファイルまだ残ってた」くらいのチェック用に使ってます。これも100%は求めてないです。

## メリット・デメリット

ここまでは実際に作業したことを中心に書いてきました。このセクションでは、メリット・デメリットをあげます。

### メリット

- 簡単なユニットテストケースの置き換えができた
- 引数のランタイムチェック（`ArgumentError`）が不要になった

Minitestなどでテストケースを書くよりは、明らかに簡単ですね。さらに、ランタイムチェックも外部入力以外ではほぼ不要です。

- ビルトインクラスや標準ライブラリの正しい使い方を学べた

例えば、[`String#match`](https://ruby-doc.org/core-2.7.2/String.html#match-method) はブロックを渡す場合は `nil` を返すことがあるのですが、その `nil` チェックが漏れていたのに気づけたケースがありました。

- クラスやメソッドの設計について、より考えるようになった

複数の型を返すメソッドや `nil` を返すメソッド、複雑な `Hash` を要求するメソッド、といったケースでは型を書くのがめんどくさくなるので、自然とシンプルなインターフェースを好むようになっていきました。
例えば、以下のようなケースです。

- `String | nil` を返していたのを `Array[String]` で返すようにした
    - `nil` を返すと呼び出し元で `nil` チェックをしないと型エラーが出ます
- [`Hash#[]`](https://ruby-doc.org/core-2.7.2/Hash.html#5B-5D-method) は `nil` を返すし、[`Hash#fetch`](https://ruby-doc.org/core-2.7.2/Hash.html#fetch-method) は記述が冗長になるので、PORO（Plain Old Ruby Object）に置き換えた
    - `Hash[Symbol, String]` のようなケースだと問題ないのですが、値が `String | Integer | bool | nil` みたいになるとチェックが難しいといった理由もあります。

### デメリット

- 学習コストが（まだ）高い
- RBSのサポートおよび型チェッカの精度が不十分

このあたりは何度も繰り返し触れてきたのですが、時間が解決してくれると信じています。
普及し始めてくると一気に改善すると思うんですよね。TypeScriptがそうであったように。

- 手書きの修正が必要

型チェックのメリットを享受するには、まだまだRBSの手書き修正が必要です（`rbs prototype` でひな型は自動生成できますが）。
まあ、ひな型だけでもメソッドのtypoや引数の個数などはチェックできはしますが、やはりせっかく書くのであれば精度を期待してしまいます。

現状は、ひな型を生成してエラーとなる箇所だけ直し、必要に応じて徐々に精度をあげていくアプローチの方が良いでしょう。
チームの学習曲線に応じて、目標を高く設定しすぎず、ゆっくりと適応していくのが良いように感じます。

- RDocをどこに書くか問題

Steep language serverでドキュメントを表示したいのであればRDocはRBSに書く必要があるのですが、そうすると実装からドキュメンテーションが離れてしまうことになり、難しい問題です。
こちらも時間が解決すると思いますが、今のところは `.rb` の方に書いておいて、うまく同期される仕組みができるのを待つのが賢明かもしれません。
（もちろん、`@param` や `@return` に型名は書きませんが）

## まとめ

想定より長文となってしまいましたが、生きているプロジェクトで試行錯誤してきた経験をこうやって出力するのは無駄ではなかろうと思っています。
（ちなみに、人生初のAdvent Calendar投稿でした）

Rubyに型を導入するというのは初めての試みであり、実際にRubyコミュニティがどう受容していくか未来は誰にもわからないですが、個人的にはRubyの開発体験を劇的に向上させる可能性があると感じています。
そして、RBSを充実させればさせるほど私たちみんなの体験が向上していくので、みなさんの貢献が欠かせません。

私個人の体験でいうと、以下のフローで理解を深めつつ貢献を増やしていくのがいいのかなぁと思っています。

1. Steepを自分の小さなプロジェクトに導入してみる。
2. RBS未提供ライブラリのポリフィルを書く。
3. 型チェックのメリットを享受する。
4. RBS未提供ライブラリのRBSを書いたパッチを [ruby/rbs](https://github.com/ruby/rbs) や [ruby/gem_rbs](https://github.com/ruby/gem_rbs) に送る。

最初は理解を深めつつ、必要になったタイミングで足りない型や間違った型のパッチを送るイメージです。
もちろん正しい型を書くにはライブラリのドキュメントや実装を読むことが必要なのですが、ソースコードリーディングの学習方法の1つとしてちょうど良いかもしれません。

実際私もいくつかパッチを投げてますが、あまり知らなかった [`IO`](https://ruby-doc.org/core-2.7.2/IO.html) クラスの挙動が学べて、かなり勉強になりました。また、慣れてくるとRBS書いてそのテストを書いて、みたいな作業が楽しくなってきます。

興味のある方は、ぜひ使ってみてください。そして、貢献できそうな部分を見つけたらパッチを送ってみてください。

Let's enjoy Ruby typing!
