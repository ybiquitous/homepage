---
published: 2023-06-03T00:30:00.000+09:00
lastUpdated: null
author: Masafumi Koba
tags: ruby, rubykaigi
---

# RubyKaigi 2023

久しぶりに（今年初めて）ブログを書く気になった。きっかけは、GW明けに松本で開催された[RubyKaigi 2023](https://rubykaigi.org/2023/)への参加だ。2019年の福岡以来、実に4年ぶりのオフライン参加となる。

松本は自宅（東京）から電車で3時間ほどと近い。前回のKaigiで松本開催が発表されたときから、ぜひ参加したいと心に秘めていた。
10年ほど前に家族で一度訪れたことがあり、そのときの良い体験が記憶に刻まれていたことも、参加を強く願う理由の1つだった。

さらには、[2020年のリベンジ](https://rubykaigi.org/2020/)、でもあった。

## 軽くふりかえる

これまでに参加したKaigiでは、なるべく多くのトークを聴こうとしていた。しかし、今回はどうしても生で聴きたいもの以外は、あえてセッションの間隔を空けるようにした。
理由は、連続して聴いているとどうしても疲れてしまっていたから。後日YouTubeにアップロードされる動画を当てにしている、というのも理由の一つ。

また、思いがけず廊下で発生する会話の可能性を残しておきたかった。実際、旧知の方にもたくさん会えたし、登壇者の方と話をすることもできた。
この、余裕をもって参加する、という選択は間違っていなかったように思う。

## 「大パーサー時代」

今回のKaigiで一番印象に残ったのは、やはりパーサー（parser）だ。初日のMatzキーノートの直後、kanekoさんのセッションのインパクトが絶大だった。

[Ruby Parser開発日誌 (9) - RubyKaigi 2023で発表してきた \~ 世はまさに”大パーサー時代” \~ - かねこにっき](https://yui-knk.hatenablog.com/entry/2023/05/23/191049)

簡単に言うと、Rubyパーサーをメンテナブルに、かつツールとして利用可能にするという野望を掲げている、と解釈している。
そのために[Lrama](https://github.com/ruby/lrama)というBison互換のツールを開発し、Kaigi期間中にこのLramaが実際にBisonを置き換えるコミットがプッシュされたことは驚きだった。

今Kaigiでは他にもパーサー関連のセッションがあった。なぜ一見地味な分野がこうも盛り上がったのか。
それを理解するためには、[Ruby 3.0リリース](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/)（2020年）から始まった流れをふりかえる必要がある。

1. Ruby 3.0における静的型解析の導入
2. VSCode＆LSPの普及
3. コード解析へのニーズの高まり

こういったものが絡み合って、今回の「大パーサー時代」に結実したと思う。この流れはこのまま加速していくだろうし、ツールやエコシステムはさらに充実していくだろう。
何かこう、右肩上がりの、ワクワクした感じがコミュニティに広まっているよう感がある。この進化のスピードは凄まじく、今のRubyでもっとも熱量を感じる分野だ。

数年前まで「コード解析」サービスを仕事にしていたという理由もあり、この領域には個人的な思い入れが特に強い。
残念ながら、開発していたサービスは昨年シャットダウンしてしまったのだが。

[YARP (Yet Another Ruby Parser)](https://github.com/ruby/yarp)のトークは見れなかったが、Lramaとどう競い合っていくのか。今後の焦点になりそう。
どちらも[github.com/ruby](https://github.com/ruby)傘下に入ったので、標準ライブラリとしてRuby 3.3にバンドルされるだろう。

この分野では、RuboCopなどが依存する[Parser gem](https://github.com/whitequark/parser)がすでに地位を確立しているが、コミュニティがどのようにLramaやYARPを受容していくのかは気になるところ。
AST構造の互換性問題もあるだろうから、RuboCopなどが簡単に基盤となるパーサーを置き換えるとは考えにくく、移行期間はしばらく続くかもしれない。

とはいえ、Ruby本体お墨付きのパーサー実装が提供されたことは大きい。今後、プログラマの道具箱に入れておくべきツールの一つになるだろう。
大量のソースコードを信頼できるやり方で検査したり書き換えたりするといったスキルが、将来のプログラマに求められてくるに違いない。

## 型とエディタ

パーサーへの注目にも負けじと、型に関するセッションも多かった。

個人的には、[KatakataIrb](https://github.com/tompng/katakata_irb)には感動した。[セットアップが超簡単](https://github.com/ybiquitous/dotfiles/commit/17e1b6eb798673c69aaeb8f1dff4c484cd25359a)で、すぐにIRB上での型補完の恩恵が受けられる。
エディタ（VSCode）を開くと、設定無しで補完や型検査が使える、というのが現代の標準開発体験になってきているが、このKatakataIrbの体験はそれに近いものを感じた。
RBSの資産がここで生きるのか…！という驚きもあった。

他のセッションでは、[Sorbet](https://sorbet.org/)とRBSを比較するトークが面白かった。SorbetはRuby DSLで型注釈を書けるのがウリだが、逆にRubyであるが故に、専用言語であるRBSと比べて表現力に限界があるという話に、なるほどと思った。

SorbetとRBSは独自の発展を遂げていくのかなぁとぼんやり思っていたが、今後は統合する流れが来るかもしれない。
Matz自身がインライン型注釈を拒絶しているし、エディタの進化の恩恵を受けて別ファイルに書くRBSの方がメリットが増していくかも。

インライン注釈については、TypeProfがエディタ重視に舵を切った話も面白いと思った。
より速度を重視して、エディタ上での開発体験を改善していくそうだ。

個人的には望むのは、エディタ上で

- メソッドの型シグネチャがハイライト表示される
- コード編集中に型検査でエラーを教えてくれる
- 実装や型定義ファイルに自在にジャンプできる
- ワンクリックでメソッドのRBSシグネチャを変更してくれる
- ホバーするとドキュメントを表示してくれる

などが実現できる世界。今はTypeProfとSteepがそれぞれに頑張っているけれど、型検査とRBS生成が1つのエディタプラグインで実現できるといいんだろうなぁと。
debug.gemなんかも含めて、1パッケージになっていると良さそう。エディタを開くだけで、設定なしで動く、というのが理想。
ちなみにGo言語は[VSCode拡張を公式で提供している](https://github.com/golang/vscode-go)ので、Rubyも公式に提供してくれる未来がを期待している。

このような体験が実現した暁には、RBSが別ファイルにある（つまりインライン注釈がない）ことによるデメリットよりも、むしろRubyコードの簡潔さがメリットとして再評価されることになりそう。型が見たくなったら、単にエディタでホバーすればよい。または、常にハイライト表示するオプションがあるとよさそう。

mameさんのセッションにもあったが、Rubyのコメントでインライン注釈を付けるシンタックスが提案されている模様。例はこちら。

```ruby
foo #: String
```

RBSはメソッドシグネチャの型定義しか提供しないので、型検査を追求していくとインライン注釈が必要になるよなとは理解しつつ、必要最小限であってほしい（以下の例を参照）、というのが個人的な願い。

```ruby
def foo
  ary = [] #: Array[String]
  10.times { |n| ary.push(n) }
  #                       ^ `n` must be String
end
```

GitHub.com（ブラウザ）上でエディタライクな機能も実現され始めているし、エディタや型推論アルゴリズムの進化により、むしろ型注釈はノイズになってくるのでは。
これが実現した世界では、型を直感的に理解できるような名前付けの方が型注釈よりも重要になるかもしれない。正確な型は、型検査ツールが担保してくれる。

ちなみに、もうすぐGitHub.com上でRBSのシンタックスハイライトが実現するはず。

[Add RBS language by ybiquitous · Pull Request #6369 · github-linguist/linguist](https://github.com/github-linguist/linguist/pull/6369)

## コマンドライン・インターフェース

偶然、Matz・hsbtさんと話す機会があり、`gem` と `bundle` コマンドは分かりにくいよね、という話をした。今後の方向性としては、`gem` と `bundle` は統合されるらしい。
だが、おそらく、道のりは険しい。

gemのインストール方法としてよくREADMEに書いてあるのが、

- `gem install <name>` を実行する
- または `gem "<name>"` を `Gemfile` に書いて `bundle install` を実行する

とだが、これはそもそも初見殺しだろうと思っていた。単に `gem install <name>` もしくは `bundle install <name>` を実行する、というのが一番簡単だ。
とはいえ、歴史的経緯もあり、互換性を維持しながら移行パスを描く、というのは大変な仕事だ。陰ながら応援したい。

`Gemfile` はRubyだから、gemインストール時にRubyを実行しなければならず、サプライチェーン攻撃の懸念がある、という話題も出た。
実行不可能なファイル形式、例えばYAMLやJSONなどが攻撃には強いが、まあ互換性の壁が高い。

そこから派生して、Rubyのコマンドライン体系の話になった。単に `ruby` コマンドを実行するとREPLが起動してほしい、という要望が来たことがあるらしく、たしかになぁと思った（例えば、Node.js）。
コンピューターに `ruby` と打ち込むと、Rubyとの対話が始まるというのは、なかなか洒落た体験のような気がする。

1つのコマンドに大量のサブコマンドを群をぶら下げる設計は、Gitが最初なんじゃないか、というMatzの話だった。
たしかに、サブコマンド方式の方が、覚える量が少なくて済むかもしれない。
今だと `irb` や `rdoc`、 `gem` などバラバラだけど、例えば `ruby repl`、`ruby doc`、`ruby install` みたいに体系化されていれば、とりあえず `ruby` と入力しさえすればシェル補完に頼ることができるというわけだ。

なかなか良さそうな気がするが、やはり互換性が…。とはいえ、人間（ヒューマンインターフェース）を重視するRubyの哲学からして、そう遠くない未来に道筋はできるかもしれない。
CLIもまた、エディタに負けず劣らず、立派なインターフェースなのだ。

## 城と城下町

市内を散策した記録もついでに残しておく。

前日に松本入りし、一通り市内を見て回った。水曜日だったこともあってか定休日の店が多かったのは、少し意外だった。

[松本城](https://www.matsumoto-castle.jp/)はしっかりと時間をかけて見て回った。過去の旅行では断念していた[旧開智学校](https://matsu-haku.com/kaichi/)にも行った。残念ながら、耐震工事中で施設内に入ることはできなかったが。

年齢を重ねるにつれ、以前よりも城や城下町に興味を抱くようになってきていると感じる。天守閣に限らず、櫓や堀に面白さが分かってきた気がする。城下町を散策するのも面白い。

普段の生活では歴史的遺構に触れることが少ないためか、時代の風雪に耐えたものを見たいと無意識に欲しているのかもしれない。最近あまりにも古いものが廃れていくスピードが速すぎるからなのか。

地名にも昔の名残が残っている。[ウィキペディア](https://ja.wikipedia.org/wiki/%E6%9D%BE%E6%9C%AC%E5%B8%82#%E5%8F%A4%E7%A7%B0)によれば、松本は古くは「深志」と呼ばれていたらしい。

> 太古の松本盆地が湿地帯であったことを示すとされる「深瀬郷」が転訛したもの

松本城も以前は「深志城」と呼ばれていたそうだ。歩いてみるとたしかに市内には川が多く、城下町一帯に水路をよく見かけた。

松本は東西を山で囲まれ、南北に沿って盆地が広がっている。川は北に向かって流れている。流れは速く、水量が多い。街道もまた、南北に走っている。

城の敷地内も平坦で、堀も他の城に比べるとかなり浅い。松本城は現存天守唯一の平城だそうだが、素人考えからすると、平坦な地形で攻められやすそうなのに、よく400年以上も残っているものだと感心する。

明治に入って、各地の天守閣が解体されていく時代の流れに松本城も危機に瀕していたところ、市民の側から天守を保全する運動が起こったそうだ。
政府の所有になった建造物を市民の寄附で買い戻すというのは、相当なことだと思う。

開智学校も明治初期に開校しているので、市民に学問や文化・芸術を好む気風があるんだろうなぁと想像している。
そういうことを感じさせてくれる街は、なかなか少ない気がする。とても尊い。現代では特に。

Rubyにも人を大事にするコミュニティ文化があるので、なんとなく、この街のもつ空気感と親和性が高いように思えた。

## 最後に

Kaigi中は、ここでは書き足りないくらい、色々な人と再会し、話をした。技術の話、仕事の話、家族の話、趣味の話…。
技術カンファレンスなのだが、根っこにある人間同士のつながりが、RubyKaigi成功のベースにある気がする。

昔の同僚と本当に久しぶりに再会できたときは、あまりに嬉しすぎて、言葉を失った…。コロナ禍や転職で、会う機会がまったくなかった。

うまく言葉にできないが、なんだかいいなぁと思えるこの感覚はRubyコミュニティ特有のような気がする。
これがa_matsudaさんが言うところの「we are so nice」なのかもしれない。

来年は沖縄。子供の時に行ったきり。ハードルは高いがぜひ参加したい。