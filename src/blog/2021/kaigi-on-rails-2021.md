# Kaigi on Rails 2021

10月22日(金)／23日(土)の2日間、[Kaigi on Rails 2021](https://kaigionrails.org/2021)に参加してきた。

[去年のアーカイブ](https://kaigionrails.org/2020)を見直してみたところ、1day開催だったと思い出した。
今年は2dayなので、運営さん大変だったんだろうな…と思いつつ、2dayだとやはり濃い体験ができた。

**2021-10-30 updated**: YouTubeに[アーカイブ動画](https://www.youtube.com/playlist?list=PLiBdJz0juoHD6LBhzv1--OtEdCBBRZv2l)が公開された！

## reBako

[reBako](https://rebako.io) というオンラインのイベント会場は、今回はじめての試み。
スポンサーブースのスタッフとして参加したのでイベント会場にいることも多く、色んな人とFace-to-Faceで会話できたのが良い体験だった。

最初は参加者・スタッフともに探り探り…といった感じだったが、徐々に特性や機能を理解して順応していったように思う。
今後、継続的にアップデートがなされるだろうし、回数を重ねれば重ねるほど慣れていくと思う。

気になった点を強いて挙げるとすると、以下のとおり。

- 個人的には2〜3人掛けの椅子席がもう少しあっても良いのかなと感じた。じっくりと話し込みたい人向け。
- 逆に、スポンサーブースはかなり空いている席があったので、ブース設計を工夫した方が良かったかも。スポンサーとの兼ね合いで難しそうだけども。

以降のセクションでは、個人的に面白かったセッションを紹介する。

## [Q&A with kamipo](https://kaigionrails.org/2021/talks/kamipo/)

@kamipoさんのQ&Aセッション。@a_matsudaさんがモデレーターとなって、お二人の軽妙なトークやRails裏話などを聞くことができた。

職を変えるくだりなんかは、ちょっと考えさせられるものがあった。あれだけRailsに貢献している人でもそうなのか、と。
OSSの持続可能性って言っちゃうと何かぼんやりしてしまうんだけども。OSSという共有財産への貢献に対して、正当な評価がなされてないんだよなぁ。

## [Railsのシステムテスト解剖学](https://kaigionrails.org/2021/talks/YusukeIwaki/)

スライド: <https://speakerdeck.com/yusukeiwaki/railsfalse-sisutemutesutojie-pou-xue>

@YusukeIwakiさんのCapybara深堀りセッション。めちゃくちゃ見たかったのだが、会社のMTGと被ってたのでリアルタイムで視聴できず…。後でアーカイブが出たら見直す予定。

**2021-10-30 updated**: アーカイブ視聴したので、感想を[Twitterに残した](https://twitter.com/ybiquitous/status/1454308923880607747)。
Capybaraがもう少しカスタマイズできるようになればよさそうなんだが… 🤔

## [Polishing on "Polished Ruby Programming"](https://kaigionrails.org/2021/talks/kakutani/)

スライド: <https://speakerdeck.com/kakutani/kaigionrails-2021>

@kakutaniさんの『[Polished Ruby Programming](https://www.amazon.co.jp/Polished-Ruby-Programming-maintainable-high-performance-ebook/dp/B093TH9P7C)』翻訳のお話。
以前から邦訳が欲しい欲しいと言い続けてて、なんと@kakutaniさんが邦訳してくださることに！来春刊行予定。絶対に買う。

書籍の話だけかと思いきや、後半はコミュニティの話に。コミュニティというよりはRubyの未来の話か。
どうもこちらが裏テーマというか、メインテーマのような気がした。

[Rubyにとって決定的に足りないものは何だと思いますか？ - Quora](https://jp.quora.com/Ruby%E3%81%AB%E3%81%A8%E3%81%A3%E3%81%A6%E6%B1%BA%E5%AE%9A%E7%9A%84%E3%81%AB%E8%B6%B3%E3%82%8A%E3%81%AA%E3%81%84%E3%82%82%E3%81%AE%E3%81%AF%E4%BD%95%E3%81%A0%E3%81%A8%E6%80%9D%E3%81%84%E3%81%BE%E3%81%99%E3%81%8B)

> これからのことを考えるとRubyに足りていないのは、初心者だと思います。

これは@shyouheiさんのQuora回答の一部引用。@kakutaniさんのセッションの裏テーマはこれだと思ってる。

経験や知識を重ねていくとどうしてもマニアックな機能の追求に走りがちだけど、敷居の低さを意識して間口を広くしないと、結局は緩やかに衰退していくということかな。
結構身につまされる思いがある。

## [FactoryBotのbuild strategiesをいい感じに直してくれるgemを作った話](https://kaigionrails.org/2021/talks/neko314/)

スライド: <https://speakerdeck.com/neko314/introduce-my-gem-factory-strategist>

`FactoryBot` の何でもかんでも `create` するのを止めたい。`build` や `build_stubbed` にすれば無駄なレコード生成が抑えられるでしょう、というもうかなり以前からある問題に対する1つの解決策を提示。

実行時にコードを差し替えるという手法で、なるほどと思った。ただ、実際に使えるかはまだハードルがあるように見えた。

昔RuboCopルール書こうかと思ったんだけど、絶対誤検知多いから難しいんだよなぁ。
この問題、知識の有無でテスト速度が変わってくるし、常に意識しないといけなくて脳が疲れるし、どうにか自動に検知できないものかなぁ…。

## [RailsエンジニアのためのNext.js入門](https://kaigionrails.org/2021/talks/hokaccha/)

スライド: <https://speakerdeck.com/hokaccha/railsenziniafalsetamefalsenext-dot-jsru-men>

ブログ: <https://hokaccha.hatenablog.com/entry/2021/10/23/135532>

@hokacchaさんの実運用に基づくNext.jsの紹介で、使い所というかRailsとの共存のあり方というか、かなりわかりやすいセッションだった。

あとでreBako上で直接話せる機会があって質問できたけど、もう少し深く聞いてみたかった。

Next.jsはパフォーマンスが最適化されているのでRailsのフロントエンドの弱点を補えるんだけど、Node.jsの知識を要求されるから、チームによっては導入のハードルが高いのが悩ましい。Client Side Renderingしかしないのであれば、まだ楽なんだけど。

でもNext.jsのアップデートとか考え出すと、やっぱりしんどいんだろうなぁ〜。
やはりRailsのフロントエンドでNext.js並のことができるのが理想的。

## [logrageの次を考える — Ruby on Railsがデフォルトで出力するログの謎に迫る](https://kaigionrails.org/2021/talks/yykamei/)

元同僚の@yykameiさんによるセッション。とても初登壇とは思えないほど、わかりやすいセッションだった。

[Lograge](https://github.com/roidrage/lograge)というgemは使ったことなかったんだけど、メンテが怪しいのでRails標準APIを使って置き換えることも検討しましょう、という@yykameiさんらしい内容。
一緒に仕事をしていたときのことを思い出して、すこしジーンとした。reBako上には現れず（？）、コンタクト取れなかったのが残念。

issueを漁ってみると、ドンピャシャなやつを見つけてしまった。

[[Question] Project status · Issue #328 · roidrage/lograge](https://github.com/roidrage/lograge/issues/328)

最近、メンテが止まってるgemをよく目にするように思う…。

## [Cache on Rails](https://kaigionrails.org/2021/talks/pocke/)

スライド: <https://docs.google.com/presentation/d/e/2PACX-1vR0xHJzkJ6kW26mROTebtOBGFHbMMEi9zFg69BOeSSZkDMqR5ONoMjZTjLeCPBpJH-yWKumEVuSkggR/pub>

ブログ: <https://pocke.hatenablog.com/entry/2021/10/27/010938>

タイトル通りキャッシュの話。`Rails.cache` のことは[Railsガイド](https://guides.rubyonrails.org/caching_with_rails.html)に乗ってるのでなんとなく知ってたんだけど、SQLキャッシュはガイドにサラッとしか書いてないので、今回始めて知った内容が多かった。

このサンプルコードがすべてを説明してくれている。

```ruby
2.times { User.first } # 2 queries

ApplicationRecord.cache do
  2.times { User.first } # 1 query
end
```

また、ブラウザの[CacheStorage](https://developer.mozilla.org/ja/docs/Web/API/CacheStorage)APIの説明もあった。使ったことないけど。
容量の問題があるし、期限切れの機能もないから、使うとしたらラッパーライブラリ経由で使うことになりそう。

こういった網羅的な説明をしつつ、可能な限りキャッシュの使用を控えるように主張していた。
まあ、キャッシュの廃棄は難しい。速度を出したいときはキャッシュが必要なんだけども。

## [Keynote by rafaelfranca](https://kaigionrails.org/2021/talks/rafaelfranca/)

キーノートセッションはRailsコミッタの@rafaelfrancaさん。ブラジル出身って知らなかったし、英語で苦労したんだなと知って共感。

OSSへの情熱が凄まじい。コミット全部読むとか、issueにすべて回答するとか。バーンアウトしたという話もされてた。
このセッションはOSSに対する気持ちを奮い立たせてくれた。アーカイブで見直したい。

## まとめ

誰が言い出したかわからないけれど、俗に言われる「Kaigi Effect[^1]」はたしかに存在すると思う。
先月のRubyKaigiしかり、今月のKaigi on Railsしかり。

セッションを視聴し、誰かと会話し、Twitterの反応を眺める。
その空気感を（オンライン越しとはいえ）共有しているという感覚が、コードを書くことへの情熱をかきたててくれる。

こういう場を提供してくれた運営のみなさんに、改めて心から感謝します。

[^1]: 「Kaigi Effect」の由来について、後日[@kakutaniさんから教わった](https://twitter.com/kakutani/status/1452993581996728328)。なんと10年前の[RubyKaigi 2011](https://rubykaigi.org/2011/ja/schedule/details/18M03/)で生まれた言葉だそう。[#kaigieffect](https://togetter.com/li/162817) というハッシュタグもある。
