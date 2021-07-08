# Dark Mode

当サイトにDark Modeを導入したので、作業ログを残す。
変更のすべては[ybiquitous/homepage#559](https://github.com/ybiquitous/homepage/pull/559)にある。

## やったこと

- Tailwind CSSに組み込みの[Dark Mode](https://tailwindcss.com/docs/dark-mode)を使った。
  デフォルトで無効になっていたので `tailwind.config.js` に1行手を入れる必要があった。
- 適当に文字色と背景色を変えていった。
- [highlight.jsのテーマ](https://highlightjs.org/static/demo/)をGitHub＆GitHub Darkに変えた。

これだけ。思ったよりも簡単だった。

## 戦略

Dark Modeの実装には2種類の戦略があることを知った。

1. [`prefers-color-scheme`](http://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) メディアクエリを使う
2. JSで動的にCSSクラスを切り替える

結果的に1を採用した。理由は一番実装が楽だったから。

2の場合はJSのコードが必要になる。反面、ボタンによってOS設定によらずに切り替えが可能になるというメリットもある。
ただ、切り替えステートをLocalStorageに保存するとか考えると面倒くさく感じた。最初の実装として、ミニマムを選んだだけとも言える。

JSのサンプルコードは[Tailwind CSSのドキュメント](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)にもあるし、[CSS-Tricksの記事](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)にもある。

アクセシビリティ（a11y）とかも考えると色とかはもっと考えたほうがいいかもしれないけど、まあ直感で見やすいものを選んだ。

## Tips

### テスト

テストをどうしようかと考えていたけど、OSの設定をその都度変えればいいだけだった。
macOSの場合は [ > System Preferences > General](https://support.apple.com/en-us/HT208976) で切り替えられる。

### 条件付き@import

highlight.jsのテーマを2つも読み込みたくないなぁと思ってググったら、[`@import`](http://developer.mozilla.org/en-US/docs/Web/CSS/@import)にメディアクエリを指定できることを始めて知った。

以下、実コードより抜粋。

```css
@import "highlight.js/styles/github.css" (prefers-color-scheme: light);
@import "highlight.js/styles/github-dark.css" (prefers-color-scheme: dark);
```

さすがにバンドルされたCSSには両方含まれる。適用されるCSSがOSの設定によって変わるだけ。

## まとめ

本当に思っていたよりも簡単で拍子抜けしてしまった。以上。
