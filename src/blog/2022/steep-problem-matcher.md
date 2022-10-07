---
published: 2022-03-10T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: ruby, steep, github-actions
---

# Steep Problem Matcher

[@sinsokuさんのSteep記事](https://sinsoku.hatenablog.com/entry/2022/03/09/234511)を最近読んで、そういえば以前[Steepに関する記事](../2020/example-of-type-checking-by-steep.md)を書いたとき、GitHub Actionsを使ってSteepエラーをレポートするためにシェルのパイプ（`|`）を使った例を紹介していたことを思い出した。

```shell
bundle exec steep check | ruby -pe 'sub(/^(.+):(\d+):(\d+): (.+)$/, %q{::error file=\1,line=\2,col=\3::\4})')
```

今は[Problem Matchers](https://github.com/actions/toolkit/blob/a502af8759e0391cba1b96229f21723034414f7e/docs/problem-matchers.md)というより便利・安全な手法を知っているので、その説明を[Gist](https://gist.github.com/ybiquitous/6e876db6be4a4148716c61b3d2f3b01a)を書いた。

以下はProblem Matcher JSONの中身：

```json
{
  "problemMatcher": [
    {
      "owner": "steep",
      "pattern": [
        {
          "regexp": "^(.+):(\\d+):(\\d+): \\[(.+)\\] (.+)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "severity": 4,
          "message": 5
        }
      ]
    }
  ]
}
```

このJSONファイルをどこかに保存して、`::add-matcher` コマンドにファイルパスを渡せば有効になる。

```yaml
steps:
  - run: echo "::add-matcher::/tmp/steep-problem-matcher.json"
```

`steep check` コマンドは以下のような出力をするので、出力行からファイルや行番号などの要素を正規表現で抜き出している。本質的にはパイプを使った方法と同じ。

```
Gemfile:1:0: [error] Type `::Object` does not have method `source`
│ Diagnostic ID: Ruby::NoMethod
│
└ source "https://rubygems.org"
  ~~~~~~

Gemfile:3:0: [error] Type `::Object` does not have method `gem`
│ Diagnostic ID: Ruby::NoMethod
│
└ gem "rbs", "~> 2.2"
  ~~~
```

`problemMatcher[*].pattern[*].code` というプロパティにエラーコードを指定できるらしく、`Diagnostic ID` を設定できると便利なんじゃないかと思ったが、なんか上手くいかなかった。同一行に存在しないと抽出できないのかもしれない。

[Steep 0.49.0](https://github.com/soutaro/steep/releases/tag/v0.49.0) で動作確認をしているので、バージョンが上がって出力形式が変わったら書き換える必要があることは注意してほしい。
