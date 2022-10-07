---
published: 2021-09-04T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: git
---

# Git Partial Clone

大きいリポジトリを `git clone` するときに時間がかかるのを避けたいときは、Gitの [Partial Clone](https://git-scm.com/docs/partial-clone) という機能を活用する。

GitHubブログに[詳しい記事](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)があるので、
時間のある場合はそちらも参照することをお勧めする。

## TL;DR

`--filter=blob:none` オプションを使えばよい。例はこちら。

```shell
git clone --filter=blob:none <url>
```

[GitHub CLI](https://cli.github.com/) を使う場合。

```shell
gh repo clone <repository> -- --filter=blob:none
```

エイリアスを指定するのもよい。

```shell
git config --global alias.fast-clone 'clone --filter=blob:none'

git fast-clone <url>
```

## `--filter` とは

以下、[公式ドキュメント](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---filterltfilter-specgt)から引用する。

> `--filter=<filter-spec>`
>
> Use the partial clone feature and request that the server sends a subset of reachable objects
> according to a given object filter. When using `--filter`, the supplied `<filter-spec>` is used
> for the partial clone filter. For example, `--filter=blob:none` will filter out all blobs (file contents)
> until needed by Git. Also, `--filter=blob:limit=<size>` will filter out all blobs of size at least `<size>`.

以下、私訳。

> Partial Clone機能を使い、与えられたオブジェクトフィルタに従って到達可能なオブジェクトのサブセットを送るようサーバに要求します。
> `--filter` を使用すると、指定された `<filter-spec>` がPartial Cloneフィルタに使用されます。
> たとえば、`--filter=blob:none` は、Gitが必要とするまですべてのblob（ファイルの内容）を除外します。
> また、`--filter=blob:limit=<size>` は、少なくとも `<size>` 以上のサイズのblobをすべて除外します。

ほとんどの場合cloneが遅いのはファイル内容（blob）が大きいからなので（特にバイナリファイル）、最新コミット（HEAD）以外のblobは必要になったときに取得すればよい。
つまり `--filter=blob:none` を指定すれば、HEAD以外のblobを遅延取得できるというわけだ。

GitHubブログでは、このblobを遅延取得する方法を特に **Blobless Clone** と呼んでいる。

## `--depth` はどうなの

`git clone` コマンドには [`--depth`](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---depthltdepthgt) オプションもあるが、
これは **Shallow Clone** という呼ばれる機能。こちらの方が古くからあるので、馴染みがあるかもしれない。

Partial Cloneとの違いは、履歴を取得するか否か。Shallow Cloneは履歴を **取得しない** ので、`git log` では正確な履歴を見ることができない。

利便性と速度を考慮すると、ほとんどの場合Shallo Cloneの方が使いやすいはず。

## まとめ

大きいリポジトリのcloneには、Partial Cloneを活用しよう！

## See also

- [git-clone Documentation](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt)
- [GitHub Blog](https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/)
- [GitHubブログ(邦訳)](https://github.blog/jp/2021-01-13-get-up-to-speed-with-partial-clone-and-shallow-clone/)
