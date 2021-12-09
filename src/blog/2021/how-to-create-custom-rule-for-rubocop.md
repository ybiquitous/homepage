# RuboCopカスタムルールを気軽に作る

*これは “[ビビッドガーデン Advent Calendar 2021](https://qiita.com/advent-calendar/2021/vivid-garden)” 17日目の記事です。*

歴史のあるRailsプロジェクトには、古くなったライブラリを使っていたり、古くなった書き方をしているコードが少なからずあると思います。

この記事では、そういった書き換えたいんだけども

- 「毎回レビューで指摘するのは心理的負担が大きい」
- 「そもそもコードベースが大きくてどのくらいあるかわからない」

…と思ってしまうようなRubyコードを探し出すため、RuboCopカスタムルールを簡単に作るテクニックをご紹介します。

## Timecopの例

[Timecop](https://github.com/travisjeffery/timecop)という現在時刻を一時的に変更できる便利なgemがあるのですが、実はRails（ActiveSupport）には同様の機能を提供する [`ActiveSupport::Testing::TimeHelpers`](https://api.rubyonrails.org/classes/ActiveSupport/Testing/TimeHelpers.html) というヘルパーモジュールがすでに存在します。

参考: [Rails: Timecopを使わなくても時間を止められた話｜TechRacho](https://techracho.bpsinc.jp/penguin10/2018_12_25/67780)

私が会社のコード（特にRSpecテストコードに）で大量にTimecopを使ったコードが見つけたとき、これをActiveSupportのTimeHelpersに置き換えたいな〜と考えました。
しかし、一気に手で直すのは面倒ですし、テストコードには安易にいじりたくはありません。

そこで、普段のワークフローに組み込むのが良いのでは？と考えました。
つまり、プルリクエストを作ったときに編集したファイルに偶然Timecopを使ったコードがあれば、RuboCopのルールで検出してプルリクエスト作者に直してもらおうという作戦です。

まさにドンピシャなルールはすでにRuboCop Railsで提案されていた（[PR rubocop/rubocop-rails#38](https://github.com/rubocop/rubocop-rails/pull/38)）のですが、マージされないまま月日が経っていたので、正式に取り込まれるまではカスタムルールでしのごうと考えました。

## カスタムルールの作成

作ったカスタムルールは、このようになりました。実際のコードと少し変えていますが、ほぼ同じものです。
（“Cop”というのはRuboCopにおけるルールの呼称です）

`lib/custom_cops/no_timecop.rb`:

```ruby
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

`.rubocop.yml`:

```yaml
require:
  - ./lib/custom_cops/no_timecop.rb

CustomCops/NoTimecop:
  Enabled: true
```

簡単に手順を示すと、次のようになります。

1. `lib/custom_cops/` ディレクトリを作る（`custom_cops` 以外でもよいです）。
2. Cop名を決める。→ `NoTimecop`
3. Cop名に合わせてファイルを作る。→ `lib/custom_cops/no_timecop.rb`
4. [`RuboCop::Cop::Base`](https://rubydoc.info/gems/rubocop/1.23.0/RuboCop/Cop/Base) を継承したクラスを作る。→ `class CustomCops::NoTimecop`
5. メッセージを `MSG` 定数にセットする。
6. `on_send` メソッドを実装する。
7. 作ったルールを `.rubocop.yml` ファイルで有効にする。→ `CustomCops/NoTimecop:`
8. `rubocop --only` コマンドでテストする。
    ```shell
    bundle exec rubocop --only CustomCops/NoTimecop`
    ```

このあたりはお作法です。[RuboCop公式ドキュメント](https://docs.rubocop.org/rubocop/1.23/extensions.html#custom-cops)も参考にしてみてください。

以下は、実装にあたっての注意点です。

## NameErrorを避ける

カスタムルールのファイル冒頭にある、以下の行が気になった方もいるかと思います。

```ruby
return unless defined?(::RuboCop)
```

これは、以下のような `NameError` を避けるためのものです。実際にデプロイしたときに発生しました。

```
NameError: uninitialized constant CustomCops::RuboCop
```

Railsでは普通、`lib/` 以下はAuto-loading対象になっているとかと思います。
これは開発環境では問題ないのですが、デプロイ環境だとRuboCopが読み込まれないように設定されていたため、エラーが発生したのでした。

## on_sendメソッド

さて、いちばん重要な `on_send` メソッドの説明に入ります。これは、メソッド呼び出しのイベントハンドラだと考えてください。

```ruby
def on_send(node)
  if node.source.include?("Timecop") && node.receiver.const_name == "Timecop"
    add_offense(node)
  end
end
```

例えば、`Timecop.travel(new_time)` というコードをRuboCopで解析すると、`travel` の呼び出しと `new_time` の呼び出しの、計2回 `on_send`  が実行されます。
`node` 引数は [`RuboCop::AST::Node`](https://rubydoc.info/gems/rubocop-ast/1.14.0/RuboCop/AST/Node) オブジェクトです。
（ASTは [Abstract Syntax Tree](https://ja.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E6%A7%8B%E6%96%87%E6%9C%A8) の略）

`node` の中身を覗いてみると、

```diff
def on_send(node)
+ pp node.source, node.receiver.class
```

雰囲気がつかめると思います。`RuboCop::AST::ConstNode` は `RuboCop::AST::Node` のサブクラスです。

```console
$ bundle exec rubocop --cache=false --only CustomCops/NoTimecop foo.rb
Inspecting 1 file
"Timecop.travel(new_time)"
RuboCop::AST::ConstNode
"new_time"
NilClass
...
```

これを踏まえて以下のコードを見ると、

```ruby
node.source.include?("Timecop") && node.receiver.const_name == "Timecop"
```

- メソッド呼び出しのソースコードに `"Timecop"` という文字列を含む。
- かつ、レシーバの定数名が `Timecop` である。

という条件を表していることが理解できるかと思います。ここのロジックが、あるコードパターンを検出するための最重要な部分です。
（`RuboCop::AST::Node` はメソッド名や引数名を取得する、といった用途向けに非常に多くのメソッドを用意しています。詳細はAPI Docを参照ください）

最後に、以下のコードで、`node` で表されたコード断片に対して `MSG` を表示するようにRuboCopに指示していると考えてください。

```ruby
add_offense(node)
```

メッセージは以下のように表示されます。

```console
$ bundle exec rubocop --cache=false --only CustomCops/NoTimecop foo.rb
...

foo.rb:1:1: C: CustomCops/NoTimecop: Timecop の代わりにRails標準の ActiveSupport::Testing::TimeHelpers が使えませんか？
Timecop.travel(new_time)
^^^^^^^^^^^^^^^^^^^^^^^^
```

## シンプルさを保つ

カスタムルールの実装において注意してほしいのは、あくまで簡易的なロジックで十分であり、`Timecop` のすべての使い方を **網羅する必要はない** ということです。
より精度を求めて誤検知を避けようとすれば、ルールのロジックはどんどん複雑になっていくでしょう。それは実装コストに見合わないかもしれません。

このカスタムルールは特定のプロジェクト内でしか使わないので、簡単なロジックで必要十分です。
簡単であればコードも理解しやすいですし、作成者以外でもメンテナンスしやすいでしょう。
（上記の例では、もしかすると `node.source.include?("Timecop")` だけでも良いかもしれません）

もし、誤検知が発生したとしても、

```ruby
Timecop.travel(new_time) # rubocop:disable CustomCops/NoTimecop
```

のように無効化コメントを付けるだけで回避できます。頑張りすぎないことがポイントです。

## まとめ

TODO
