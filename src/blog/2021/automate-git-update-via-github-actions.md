---
slug: 2021/automate-git-update-via-github-actions
title: Gitを自動でアップデートするGitHub Actionを書いた
published: 2021-06-30T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: github-actions
---

# Gitを自動でアップデートするGitHub Actionを書いた

## TL;DR

成果物は[Gistに保存した](https://gist.github.com/ybiquitous/9a43fb94de2b3a632a391599df0b6af6)。

簡単に言うと、あるファイルで

```diff
-GIT_VERSION=1.2.3
+GIT_VERSION=1.2.4
```

という更新を自動で行うGitHub Actionを書いたという話。

## もう少し詳しく

あるファイルにGitのバージョンが書かれていて、そのバージョンを更新する作業は今まで手動でやっていたのだけれど、GitHub Actionsで自動化してみよう、とふと思い立った。

GitのリポジトリはGitHub上にある（[git/git](https://github.com/git/git)）ので、GitHub APIで最新のバージョンを取得して、そのバージョンでファイルを更新すればよい。
しかし、git/gitはGitHub Releasesを使ってないので、「最新のバージョンを取得する」という作業がめんどくさい。
GitHub REST APIには、Gitタグ一覧を取得するAPIがあるが、ソートオプションが無いので「最新」を取るためには、全件取得してこちら側でソートする、みたいな処理が必要というわけだ。

```
GET /repos/{owner}/{repo}/git/matching-refs/{ref}
```

<https://docs.github.com/en/rest/reference/git#list-matching-references>

Actions の YAML に複雑なロジックは書きたくないのでもう少し方法を探すと、GitHub GraphQL APIが見つかった。

## GraphQL API

GitHubのGraphQL APIドキュメントページには[Explorer](https://docs.github.com/en/graphql/overview/explorer)という便利なアプリケーションが用意されており、実データでAPIを試すことができる。

<details><summary>Input:</summary>

```
{
  repository(owner: "git", name: "git") {
    refs(refPrefix: "refs/tags/", first: 1, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
      edges {
        node {
          name
        }
      }
    }
  }
}
```

</details>

<details><summary>Output:</summary>

```json
{
  "data": {
    "repository": {
      "refs": {
        "edges": [
          {
            "node": {
              "name": "v2.32.0"
            }
          }
        ]
      }
    }
  }
}
```

</details>

個人的にはREST APIを `curl` で叩く方が好きで、GraphQL APIをあまり使ってこなかったが、単に慣れの問題かもしれない。GitHub的にもGraphQL APIを推す雰囲気を感じる。

ActionsでGraphQL APIを叩く方法は色々ありそうだが、[octokit/graphql-action](https://github.com/octokit/graphql-action)というものが公式っぽい雰囲気なので、これを使うことにした。
クエリをYAMLファイルに直に書いて、結果を `steps.{id}.outputs.data` で受け取る。JSON 化したい場合は `toJson()` を使う。

## PRを作る

最新のタグが取れたので、あとはタグから `v` プレフィックスを取り除いたり、ファイルに書いてある現在のバージョンを取得したり…、といったことをシェルスクリプトでYAMLにガリガリ書いていく。
おなじみの `sed` や `grep` などですね（使い方は毎回ググってる）。

ファイルを更新できたら、定番の[peter-evans/create-pull-request](https://github.com/peter-evans/create-pull-request)でPRを作ればおしまい。
PRのタイトルや本文、コミットメッセージなどは適当に設定する。

## 感想

結構GitHub Releasesを作らないリポジトリを見かけるが、ボタン1つでタグから作成できるからできるだけ作って欲しいなぁ、という気持ちがある（中身なくてもいい）。

最新リリースは以下のREST APIで簡単に取得できる。

```
GET /repos/{owner}/{repo}/releases/latest
```

<https://docs.github.com/en/rest/reference/repos#get-the-latest-release>

Feedも簡単に取得できるし、Watch only Releasesもできるから、作るメリットの方が大きいと思う。もちろんActionsでRelease作成も自動化できる。

以上。
