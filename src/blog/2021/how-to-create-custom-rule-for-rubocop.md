---
slug: 2021/how-to-create-custom-rule-for-rubocop
title: RuboCopカスタムルールを気軽に作る
published: 2021-12-17T00:00:00.000Z
lastUpdated: 2021-12-17T00:00:00.000Z
author: Masafumi Koba
tags: rubocop, ruby
---

# RuboCopカスタムルールを気軽に作る

*これは “[ビビッドガーデン Advent Calendar 2021](https://qiita.com/advent-calendar/2021/vivid-garden)” 17日目の記事です。*

歴史のあるRailsプロジェクトには、古くなったライブラリを使っていたり、古くなった書き方をしているコードが少なからずある。
この記事では、そのような書き換えたいんだけれども一気にやるのは怖い、といったコードを徐々に書き換えていく方法の1つとして、カジュアルにRuboCopルールを作るテクニックを紹介する。

ここでの「カジュアル」は、精度を求めない、という意味。誤検知（false positive）を減らそうとしてルールの実装に時間をかけるのではなく、多少の誤検知を許容して簡単にルールを追加しよう、というやり方。

複数人チームでの運用を想定している。

## Timecop

[Timecop](https://github.com/travisjeffery/timecop)という現在時刻を一時的に変更できる便利なライブラリがあるが、実はRails（ActiveSupport）には同様の機能を提供する [`ActiveSupport::Testing::TimeHelpers`](https://api.rubyonrails.org/classes/ActiveSupport/Testing/TimeHelpers.html) というヘルパーモジュールがすでに存在する。

参考: [Rails: Timecopを使わなくても時間を止められた話｜TechRacho](https://techracho.bpsinc.jp/penguin10/2018_12_25/67780)

ライブラリへの依存は極力少なくしたいが、しかし、一気に手で直すのは面倒だし、テストコードを安易にいじりたくない。

少し調べてみると、RuboCop RailsにTimecopの書き換えを推奨するルールが提案されているのを見つけた。

[Add Timecop cop by sambostock · Pull Request #38 · rubocop/rubocop-rails](https://github.com/rubocop/rubocop-rails/pull/38)

がしかし、マージされないままかなり月日が経っていたので、正式に取り込まれるまではカスタムルールでしのごうと考えた。

## カスタムルールの作成

作ったカスタムルールは、以下の通り。
（ちなみに、“Cop”というのはRuboCopにおけるルールの呼称のこと）

```ruby
# lib/custom_cops/no_timecop.rb
return unless defined?(::RuboCop)

module CustomCops
  class NoTimecop < ::RuboCop::Cop::Base
    MSG = "`Timecop` の代わりにRails標準の `ActiveSupport::Testing::TimeHelpers` が使えませんか？".freeze

    def on_send(node)
      if node.source.include?("Timecop") && node.receiver.const_name == "Timecop"
        add_offense(node)
      end
    end
  end
end
```

作ったカスタムCopは、RuboCop設定ファイルで有効にする。

```yaml
# .rubocop.yml
require:
  - ./lib/custom_cops/no_timecop.rb

CustomCops/NoTimecop:
  Enabled: true
```

簡単に手順を示すと、次のとおり。

1. `lib/custom_cops/` ディレクトリを作る。
2. Cop名を決める。（例．`NoTimecop`）
3. Cop名に合わせてファイルを作る。（例．`lib/custom_cops/no_timecop.rb`）
4. [`RuboCop::Cop::Base`](https://rubydoc.info/gems/rubocop/1.23.0/RuboCop/Cop/Base) を継承したクラスを作る。（例．`class CustomCops::NoTimecop`）
5. メッセージを `MSG` 定数にセットする。
6. `on_send` メソッドを実装する。
7. Copを `.rubocop.yml` ファイルで有効にする。（例．`CustomCops/NoTimecop`）
8. `rubocop --only` コマンドでテストする。
    ```shell
    bundle exec rubocop --only CustomCops/NoTimecop
    ```

[RuboCop公式ドキュメント](https://docs.rubocop.org/rubocop/1.23/extensions.html#custom-cops)も参考になる。

以下のセクションでは、実装にあたっての注意点を挙げる。

## NameErrorを避ける

カスタムルールのファイル冒頭にある以下の行は、

```ruby
return unless defined?(::RuboCop)
```

`NameError` を避けるためのもの。このエラーは実際にデプロイしたときに発生した。

```
NameError: uninitialized constant CustomCops::RuboCop
```

~~Railsでは普通、`lib/` 以下はAuto-loading対象になっているかと思う。~~[^1]
これは `lib/` がAuto-loading対象になっていたことが原因だった。

また、普通RuboCopは開発用としてインストールする。

```ruby
# Gemfile
group :development do
  gem "rubocop", require: false
end
```

この場合、開発環境（`RAILS_ENV=development`）では問題ないのだが、本番環境（`RAILS_ENV=production`）ではRuboCopが読み込まれないので、起動時に `NameError` となってしまう。
そこで `defined?(::RuboCop)` というチェックを入れている。他にもっといい方法があるかもしれない。

## on_sendメソッド

さて、いちばん重要な `on_send` メソッドの説明に入る。これは、ソースコード内のメソッドコールを検出するもの、と考えるとよい。

```ruby
def on_send(node)
  if node.source.include?("Timecop") && node.receiver.const_name == "Timecop"
    add_offense(node)
  end
end
```

例えば、`Timecop.travel(new_time)` というコードをRuboCopで解析すると、`travel` と `new_time` の計2回、`on_send`  が実行される。
つまり、RuboCopがコード内のメソッド呼び出し部分を発見し、そのたびに `on_send` を実行するのだ。

`node` 引数には [`RuboCop::AST::Node`](https://rubydoc.info/gems/rubocop-ast/1.14.0/RuboCop/AST/Node) オブジェクトが渡される。
（ASTは [Abstract Syntax Tree](https://ja.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E6%A7%8B%E6%96%87%E6%9C%A8) の略）

`node` の中身を覗くためにデバッグコードを入れて、

```diff
def on_send(node)
+ pp node.source, node.receiver.class
```

実行してみる。

```console
$ bundle exec rubocop --cache=false --only CustomCops/NoTimecop foo.rb
Inspecting 1 file
"Timecop.travel(new_time)"
RuboCop::AST::ConstNode
"new_time"
NilClass
...
```

すると、メソッド呼び出し部分のコードを表した文字列とASTオブジェクトが出力されているのが分かる。
（`RuboCop::AST::ConstNode` は `RuboCop::AST::Node` のサブクラス）

これを踏まえて以下のコードを見ると、

```ruby
node.source.include?("Timecop") && node.receiver.const_name == "Timecop"
```

- メソッド呼び出しのソースコード文字列（`node.source`）に `"Timecop"` を含む。
- かつ、メソッド呼び出しのレシーバの定数名が `"Timecop"` である。

という条件を表していることが理解できるかと思う。ここのロジックが、あるコードパターンを検出するための最重要な部分。
（`RuboCop::AST::Node` クラスはメソッド名や引数名を取得する、といった用途向けに非常に多くのメソッドを用意している。詳細はRuboCop API Docを参照）

この条件にマッチした場合に、

```ruby
add_offense(node)
```

は `node` に対して `MSG` を表示するよう、RuboCopに指示する。

メッセージは次のように出力される。

```console
$ bundle exec rubocop --cache=false --only CustomCops/NoTimecop foo.rb
...

foo.rb:1:1: C: CustomCops/NoTimecop: Timecop の代わりにRails標準の ActiveSupport::Testing::TimeHelpers が使えませんか？
Timecop.travel(new_time)
^^^^^^^^^^^^^^^^^^^^^^^^
```

## カジュアルに

冒頭でも述べたが、カスタムCop実装において注意してほしいのは、あくまで簡単なロジックから始める、ということ。
つまり、`Timecop` のすべての使い方を **網羅する必要はない**。

より精度を求めて誤検知を避けようとすれば、ルールのロジックはどんどん複雑になっていくし、メンテも辛くなっていく（他のメンバーが見てもわからないものになる）。
辛くなると、ルールを書こうという動機は薄れるし、ルールを書くという行為がチームに波及していかない。

こういったカスタムルールは特定のプロジェクト内でしか使わないので、簡単なロジックで必要十分だと思っている。

たとえ誤検知が発生したとしても、

```ruby
Timecop.travel(new_time) # rubocop:disable CustomCops/NoTimecop
```

のように無効化コメントを付けるだけで回避できる。数が多くなければ、これでも十分だろう。

## まとめ

プロジェクト内でのみ通用するカスタムRuboCopルールを、カジュアルに書くという方法を提案した。
RuboCop APIの学習コストを抑え、チーム内でカスタムルールを書く動機づけを促す、というのが大事だと思っている。

もちろん、ドキュメントを見て既存のルールで利用できるものはないか探したり、便利そうなルールを思いついたらissueやプルリクエストを送るのも良いだろう。

しかし、多くの人が使うルールは、マージまでの期間が長くなりがちだ（誤検知との闘いもある）。
そういった場合に、「カジュアルなカスタムCop」を知っておくことは、1つの武器となるだろう。

[^1]: デフォルトでは `lib/` はAuto-loading対象にならない。勘違いしていた。（2021-12-17 修正）
