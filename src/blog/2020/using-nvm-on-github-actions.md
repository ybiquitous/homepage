# GitHub Actionsでnvmを使う

よく忘れるので、GitHub Actionsで[nvm](https://github.com/nvm-sh/nvm)を使う方法をメモしておく。

## 基本的にはactions/setup-nodeだけでよい

### 2021年12月2日追記

[actions/setup-node@v2.5.0](https://github.com/actions/setup-node/releases/tag/v2.5.0)が `node-version-file` オプションに対応した。
つまり、`.nvmrc` の内容を出力するステップは不要となり、よりシンプルなコードが書ける。最高。

```yaml
steps:
  - uses: actions/setup-node@v2
    with:
      node-version-file: .nvmrc
```

---

### 2021年7月7日追記

[actions/setup-node@v2.2.0](https://github.com/actions/setup-node/releases/tag/v2.2.0)がnvm互換の `lts` エイリアスに対応した（例．`lts/*`）。

したがって基本的には（未サポートのnvm固有シンタックスを使ってないかぎり）、以下のようにactions/setup-nodeの `node-version` に `.nvmrc` の値をセットするだけで良いんじゃないかと思う。

```yaml
# See: https://github.com/actions/setup-node/issues/32#issuecomment-539794249
steps:
  - run: echo "::set-output name=nvmrc::$(< .nvmrc)"
    id: nvm
  - uses: actions/setup-node@v2
    with:
      node-version: "${{ steps.nvm.outputs.nvmrc }}"
```

（当サイトでも[ybiquitous/homepage#545](https://github.com/ybiquitous/homepage/pull/545)にて変更）

`bash` のこととか考えなくて良くなるし、actions/setup-nodeビルトインの[Problem Matchers](https://github.com/actions/toolkit/blob/45647689407e7fb224e06d066dde6aefa67a365f/docs/problem-matchers.md)も使えるし。
多くの場合、Node.jsイメージのキャッシュも効くはず。

どうしても `nvm` を使いたい場合は、従来どおり以下の内容が有効。

## nvmはプリインストール済み

2020年6月4日現在、nvmは `ubuntu-latest` (Ubuntu 18.04) イメージに[デフォルトでインストール](https://github.com/actions/virtual-environments/blob/ubuntu18/20200604.1/images/linux/Ubuntu1804-README.md)されている（バージョンは **0.35.3**）。つまり、サードパーティのActionを入れる必要はない。

## 使い方

以下の例にあるように、`nvm` コマンドを使う場合は `shell: bash --login {0}` （または `bash -l {0}`）が必須となる（参照：[actions/virtual-environments#582](https://github.com/actions/virtual-environments/pull/582#issuecomment-617659430)）。

```yaml
# .github/workflows/nvm.yml
name: nvm
on: [push]
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - run: nvm install 14.3.0
        shell: bash --login {0} #<-- 必須！
```

この `shell` 設定がない場合、以下のエラーが出る（[参考](https://github.com/ybiquitous/using-nvm-on-github-action/pull/1/checks?check_run_id=742988829#step:2:4)）。

> nvm: command not found

一度 `nvm install` が成功すると、そのバージョンが `default` エイリアスに設定される。そのため、毎回 `nvm exec` をつけてコマンドを実行する必要はない。
ただし、注意しないといけないのは、`shell: bash --login {0}` が `nvm install` 以降の `run` で省略できないことだ。
この設定を忘れてしまうと、`ubuntu-latest` イメージにプリインストールされたNode.jsが使われてしまう。これはログを注意深く見ないと気づかない可能性が高い。

```yaml
steps:
  - run: nvm install 14.3.0
    shell: bash --login {0}
  - run: node --version #=> "12.16.3" (preinstalled version)
  - run: node --version #=> "14.3.0" (nvm installed version)
    shell: bash --login {0}
```

しかし、毎回忘れずに `shell` を書くのはなかなか大変である。どうしても漏れが発生するだろう。

そこで、`PATH` 環境変数を書き換えてしまうという荒業を用いる。[`::set-env name={name}::{value}`](https://help.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable) という形式の文字列を出力することで、`export PATH=...` と同様のことができる。

nvmが設定してくれる `NVM_BIN` 環境変数が使って、以下のように書ける。

```yaml
steps:
  - run: node --version #=> "12.16.3"
  - run: |
      nvm install 14.3.0
      echo "::set-env name=PATH::${NVM_BIN}:${PATH}"
    shell: bash --login {0}
  - run: node --version #=> "14.3.0"
```

これで、`shell: bash --login {0}` を1回だけ書けば済むようになった。

### `shell` が必要な理由

nvmを使うには `.bashrc` や `.bash_profile` を読み込む必要がある。しかし、GitHub Actionsでの `shell` のデフォルト値は `bash --noprofile --norc -eo pipefail {0}` なので（[ドキュメント](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsrun)）、それらのファイルをデフォルトでは読み込んでくれないのである。

## まとめ

多くのケースでは `.nvmrc` ファイルをリポジトリにコミットすると思うので、普通は [actions/checkout](https://github.com/actions/checkout) を使ってこのように書くだろう（ちなみに、`--latest-npm --no-progress` を付ける付けないは好みである）。

```yaml
name: nvm
on: [push]
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: |
          nvm install --latest-npm --no-progress
          echo "::set-env name=PATH::${NVM_BIN}:${PATH}"
        shell: bash --login {0}
      - run: ... # using `node` or `npm`
```

このやり方では [actions/setup-node](https://github.com/actions/setup-node) を使う必要はない。setup-node に比べると若干コードが増えてハックじみてるが、`.nvmrc` を使っているリポジトリ（特にアプリケーション）では有益な方法だと思う。

こちらのリポジトリに実際の動作を残しておく。
[ybiquitous/using-nvm-on-github-action](https://github.com/ybiquitous/using-nvm-on-github-action)
