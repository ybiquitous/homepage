# コマンドラインでプルリクエストを作る

## hub とは

私は普段 Git をコマンドライン（シェル）で使っていて、[hub](https://hub.github.com) という GitHub 謹製のコマンドラインツールを愛用している。

[hub · the command-line wrapper for git](https://hub.github.com/)

簡単に言ってしまうと hub とはコマンドラインから Git や GitHub を扱うツールで、[hub-pr(1)](https://hub.github.com/hub-pr.1.html) のように GitHub 固有のコマンドもあれば、 [hub-checkout(1)](https://hub.github.com/hub-checkout.1.html) のように標準の [git-checkout(1)](https://git-scm.com/docs/git-checkout) を拡張したコマンドもある。詳しくは、hub の[マニュアル](https://hub.github.com/hub.1.html)を参照されたい。

今回は、この hub が提供するコマンドの中で、最近私が特に愛用しているコマンドを紹介する。

## hub pull-request

[hub-pull-request(1)](https://hub.github.com/hub-pull-request.1.html) はプルリクエストを作るためのコマンドである。使い方は単純に 、`master` 以外のブランチで以下のコマンドを実行するだけである。

```shell
$ hub pull-request
```

これだけでエディタが開き、保存すれば、GitHub にプルリクエストが作られる。
コミットメッセージを Markdown で書いておけば、コミットメッセージがそのままプルリクエストのタイトルと説明になる。
もちろんエディタ上で、タイトルと説明は編集可能だ。

以下、公式マニュアルに記載されてあるコマンド実行例を抜粋する。

```shell
$ hub pull-request
[ opens a text editor for writing title and message ]
[ creates a pull request for the current branch ]

$ hub pull-request --base OWNER:master --head MYUSER:my-branch
[ creates a pull request with explicit base and head branches ]

$ hub pull-request --browse -m "My title"
[ creates a pull request with the given title and opens it in a browser ]

$ hub pull-request -F - --edit < path/to/message-template.md
[ further edit the title and message received on standard input ]
```

これは最近気づいたのだが、`--push`、`--draft`、`--browser` というオプションが用意されていて、これが非常に便利なので以下のようにエイリアスをつくって利用している（エイリアス名が長いという人もいるかもしれないが、シェルの補完が利くので問題にはなってない）。

```shell
alias open-pull-request='hub pull-request --push --draft --browse'
```

オプションの説明は、ざっと以下である。

- `--push`: 現在のブランチを remote にプッシュする。
- `--draft`: プルリクエストをドラフトで開く（ドラフトについての詳細は、こちらの[公式ブログ](https://github.blog/2019-02-14-introducing-draft-pull-requests)を参照のこと）。
- `--browse`: プルリクエストをブラウザで開く。

例えば、典型的なワークフローを示す。

```shell
$ git checkout master
(...いくつかファイルを編集...)

$ git add .
$ git commit
(...コミットメッセージをエディタで入力・保存...)

$ open-pull-request
(...プルリクエストのタイトル・説明をエディタで入力・保存...)
```

ドラフトで開くのは、一応ブラウザで最終確認したいからである。レビューの用意ができれば、ボタンクリック 1 つで Draft→Ready にできるので、そこまで手間だとは思わない。
このあたりは、それぞれの用途に合わせればよいと思う。

## まとめ

私にとって普段の作業は Git ＝ GitHub なので、`hub` は今やなくてはならないものである。
本稿を書いている最中、`hub` は GitLab や Bitbucket で使えるのか？と疑問に思ったので調べてみると、次の issue を見つけた。

[gitlab support plz · Issue #1383 · github/hub](https://github.com/github/hub/issues/1383)

…やはり欲しくなるのだろう。`hub` は「GitHub の準公式 CLI ツール」らしいので、GitHub しかサポートされてないと明言されてある。
GitLab 向けに `lab` という似たようなツールを作っている人もいる。

[lab | Lab wraps Git or Hub, making it simple to clone, fork, and interact with repositories on GitLab](https://zaquestion.github.io/lab/)

昨今、VS Code など IDE の進化がすさまじいが、私はコマンドラインが好きなので、今後もこういうツールが消えないで欲しいと思っている。
