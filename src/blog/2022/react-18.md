---
slug: 2022/react-18
title: React 18
published: 2022-04-21T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: react
---

# React 18

2022年3月29日、[React 18がリリースされた](https://reactjs.org/blog/2022/03/29/react-v18.html)。

`@types/*` パッケージなどのエコシステムも対応してきたので、このホームページのReactもアップデートした。

`ReactDOM.render()` が非推奨になるなど若干コードの書き換えが必要だったが、[アップグレードガイド](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)を参考にしつつすんなりとアップデートできた。

こちらが[対応プルリクエスト](https://github.com/ybiquitous/homepage/pull/834)。

ぼちぼち [`<Suspense/>`](https://reactjs.org/docs/react-api.html#reactsuspense) も試したいな〜と思っている。
ブログページ（`/blog/:slug`）ではMarkdownコンテンツをDynamic Import（Code Splitting）でロードしているので、そこは `<Suspense/>` で書き換えられそう。ソースは[こちら](https://github.com/ybiquitous/homepage/blob/c061d531bfe1eb1d026364e758b44fb149028ff4/src/blog/index.js#L8)。
