---
published: 2021-11-03T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: test, percy
---

# Introduce Percy

ぼちぼち、当サイトにもテストが必要になってきた。Dependabot PRを安心してマージしたい、というのがその主な理由だ。

テストと言っても当サイトにインタラクティブな部分はないので、Visual Regression Testが良さそうだと思い、いくつか検討してみた。

## Visual Regression Testとは

画像に関する回帰テストのことで、取得したスナップショットをコミット間やブランチ間で比較するテスト手法を指す。
一般的には、ピクセル単位で画像の比較をすると思う。

誰が言い始めたのか気になったので軽く調べてみたけど、見つからなかった。
代わりに、[Awesomeリポジトリ](https://github.com/mojoaxel/awesome-regression-testing)を見つけた。
OSSツールやらSaaSやら、かなり沢山ある。

## 検討

OSSツールだと[reg-suit](https://github.com/reg-viz/reg-suit)が有名だろうか。
他に探してみると、Jestのプラグイン[jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot)もあった。

もっと大きなフレームワークだと、E2Eテスト向けの[Cypress](https://www.cypress.io/)や[Playwright](https://playwright.dev/)なんかも検討した。

ただ、ページ数も少ないし、あんまりテストコードやCIコードで頑張りたくないなぁという思いがあった。
最近のツールだとセットアップも簡単だし、テストコードも似たような書き味なのだが、アップデートして壊れたりすることが不安だった。

回帰テストの性質上、スナップショットを保存しておくストレージが必要だし、GitHub Actionsであんまり頑張りたくないなぁと。

## Percyに決定

コードを書きたくない以上SaaSを使うしかなく、以前仕事で使ったことのある[Percy](https://percy.io)に決めた。
（他のSaaSは多すぎて検討する気にもならなかった）

（多分、他のSaaSも同じだと思うけど）Percyはスナップショットの比較UIとスナップショットアップロード用のツールを提供してくれる。
つまりストレージのことは考えなくてもよく、スナップショットの比較も専用UIがあるので見やすい。マルチブラウザにも対応している。

Percyは[BrowserStack](https://www.browserstack.com)に買収される前から結構使っていたので、何ができるかは大体知っていたし、無料プランだと【5,000スクリーンショット/月】可能なので、まあ問題ないだろうと判断した。

さて、次はPercyにスナップショットを送るための方法を考えなければならない。
以前の仕事では、Percyが提供するCapybara連携用のgemを使い、Railsシステムテスト（Capybara）からPercyにアップロードしていた。
今回はテストコードがない。さて、どうしたものか。

## テストコードをYAMLで書ける

PercyのドキュメントにはCapybaraやCypressなどの比較的有名なテストツールとの連携方法が書いてあるのだが、
[Percy Snapshot](https://docs.percy.io/docs/percy-snapshot)というPercy独自のYAMLでテストを書ける方法を発見した。

YAMLにこんな風にテストを書ける。任意のJSも書けるらしい。

```yaml
- name: First example
  url: http://localhost:8080
- name: Second example
  url: http://localhost:8080/two
```

必要なのは、YAMLテストコードと、アップロード用のCLIツールだけ。
[ybiquitous/homepage#669](https://github.com/ybiquitous/homepage/pull/669)がその変更を書いたPRだ。

単純なサイトだと、これが一番オススメできる方法だと思う。
