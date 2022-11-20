---
published: 2022-11-20T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: font
---

# Fira Codeフォントを試す

数年前から[JetBrains Mono](https://www.jetbrains.com/lp/mono/)フォントを常用していたのだけれど、ふと思い立って最近の人気のプログラミング用フォントを探してみたところ、どうも[Fira Code](https://github.com/tonsky/FiraCode)というフォントが人気らしいことがわかった。

ちなみに、[MonoLisa](https://www.monolisa.dev/)というフォントも人気らしいが、これは有料（最安プランで¥8,000弱）だったので断念した。

## Fira Codeとは

READMEによれば、プログラミング用の[リガチャ](https://ja.wikipedia.org/wiki/%E5%90%88%E5%AD%97)に特化したフォントとのこと。例えば、`=>` とか `>=` のような文字記号の組み合わせはプログラミング言語によっては特別な意味をもつが、視覚的に誤認しやすい。その場合、リガチャ（合字）で専用の文字を表示するようにすれば、視認性が良くなる。

## インストール

Homebrewですんなりインストールできた。

```shell
brew install --cask font-jetbrains-mono
```

## Emacs設定

私の愛用しているエディタのEmacs（現在バージョン28.2）はデフォルトでリガチャを表示してくれないので、表示するためのパッケージをインストールする。

Fira CodeのREADMEには親切にも[エディタ対応表](https://github.com/tonsky/FiraCode#editor-compatibility-list)が用意してあり、各エディタのリガチャ対応状況を知ることができる。また、Emacs向けには専用の[Wikiページ](https://github.com/tonsky/FiraCode/wiki/Emacs-instructions)が用意してあり、そこに書いてあった [ligature.el](https://github.com/mickeynp/ligature.el) パッケージを使うことにした。

MELPAに登録してあったので、`use-package` で簡単にインストールできた。設定は次のとおり。

```
(use-package ligature
  :config
  (ligature-set-ligatures 'prog-mode '(...))
  (ligature-set-ligatures 'markdown-mode '(...))
  (global-ligature-mode t))
```

`ligature-set-ligatures` 関数を使ってリガチャ対象の文字列のリストを登録する。

完全なコードは[こちら
](https://github.com/ybiquitous/.emacs.d/blob/9589d5b616b00bc30d5912e9bb0a7c00559c9b89/inits/init-ligature.el)。

## 感想

JetBrains Monoと違って若干見やすくなった気もするが、何が変わったかと言われると難しい。JetBrains Monoにもリガチャサポートはあったが、なぜか無効にしていたので入れた当時はあんまり気に入らなかったのかもしれない。それか、単にめんどくさかっただけか。

Fira Codeは数日試してみて、気に入ったら切り替えようと思う。
