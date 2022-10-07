---
slug: 2021/css-modules-to-tailwindcss
title: CSS ModulesからTailwind CSSに切り替えた
published: 2021-07-08T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: css, css-modules, tailwindcss
---

# CSS ModulesからTailwind CSSに切り替えた

このサイトのCSS実装をCSS ModulesからTailwind CSSに切り替えたので、備忘録として残す。

PR [ybiquitous/homepage#542](https://github.com/ybiquitous/homepage/pull/542)が変更のすべて。
（デザインも少し変えたので、diffが大きくなってしまった… 😥）

## 移行理由

- たしか [The State of CSS 2020](https://2020.stateofcss.com/en-US/technologies/css-frameworks/) で人気トップであることは認知しており、気にはなっていた。
- 当初はなるべくフレームワーク非依存の方針があり、サイトの統一性を維持するために[CSS変数](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)を使っていた。
  （spacingとか、colorとかを定義し、値を直接ハードコードしないようにしていた）
- ただ、この程度の規模でもそれなりに変数は増えていくので、管理がめんどくさくなっていた。
- カラーテーマをもう少し改善したいとか、ダークモード入れたいとかを考えていると、余計に自前だとキツく感じるようになった。
- Boostrapとか大きめのフレームワークは入れたくなかった。JSライブラリは別に要らない。

…以上のことなどを頭に入れつつ、少し時間ができたので、作者がTailwind CSSを作った意図を書いた[ブログ](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)を読んでみた。

従来のCSS設計が「セマンティクス」に拘り過ぎていて、

- 名前付け難しい
- コンポーネント分割の指針がブレる
- バリエーションを増やすために、コンポーネントに *modifiers* 追加していくのメンドイ

みたいな主張には共感した。そこで「Utility-first CSS」だと。

## Tailwind CSS

詳細は[公式](https://tailwindcss.com/)に譲るとして、フレームワークと言うよりむしろ、CSSユーティリティクラス集のようなもの。
[PostCSS](https://postcss.org/)プラグインとして実装されているので、既存のPostCSS設定に簡単に組み込める点がすごく気に入った。

CLIとかも入ってるっぽいけど、既存のwebpack設定があったので、そこに単に組み込んだだけ。
以下は [`package.json`](https://github.com/ybiquitous/homepage/blob/07cbecaafa42d0651f34fad1378991b321f8251e/package.json#L196-L202) から抜粋したPostCSS設定のすべて。すごくシンプル。

```json
{
  "postcss": {
    "plugins": [
      "tailwindcss/nesting",
      "tailwindcss",
      "autoprefixer"
    ]
  }
}
```

さらに、不要CSSの削除もできると知ったので、その設定のために [`tailwind.config.js`](https://github.com/ybiquitous/homepage/blob/07cbecaafa42d0651f34fad1378991b321f8251e/tailwind.config.js#L2-L5) を追加した。これだけ。

```js
module.exports = {
  mode: "jit",
  purge: ["./src/*.html", "./src/**/*.jsx"],
};
```

あとは、既存のCSSを淡々とクラス名に置き換えていく作業。`margin: var(--space-m);` → `className="m-4"` みたいに。
このクラス名を覚えるのが一番大変で、ドキュメントとにらめっこしながら、必要なクラス名を探していった。
このあたりは多少学習コストが高くて、LSPに対応しているらしいんだけど、自前のEmacsでは動かすことができなかった。
命名が一貫しているので、慣れればLSPなくてもある程度は大丈夫。まあ、LSPで補完できるに越したことはない。

それ以外だと、Markdownのスタイルを付けるのがめんどくさかった。Markdownから生成されたHTMLにはもちろん `mt-4` みたいなクラス名は付かないから、ここはカスケードの力を借りるしかない。

幸い、Tailwind独自の@ルールを使って、CSSにクラス名を書けることができるようになっていた。以下は、抜粋。

```css
.markdown {
  & > h1 {
    @apply font-sans font-semibold;
  }
}
```

全体は [`index.css`](https://github.com/ybiquitous/homepage/blob/07cbecaafa42d0651f34fad1378991b321f8251e/src/index.css#L24) にある。

独自@ルールに正直「うっ」となったけど、まあ許容範囲かな。

ブレークポイントもカラーも揃っているし、`:focus` とか `::before` にも対応してて、あらかじめ用意されているクラスで十分にまかなえる。
Markdownのような例を除けば、素のCSSを書くことはほとんどなかった。

## CSS Modules

一応、簡単にCSS Modulesにも触れておく。
仕様は[css-modules/css-modules](https://github.com/css-modules/css-modules)にある。
普通はwebpackの[css-loader](https://github.com/webpack/css-loader)を使うと思う。

簡単に言うと、CSSのスコープを狭めることができる。移行前は以下のようなコードを組んでいた。

```jsx
// Blog.jsx
import s from "./Blog.module.css";
export const Blog = () => {
  return <div className={s.container}>...</div>;
};
```

```css
/* Blog.module.css */
.container {
  margin: var(--space-m) 0;
}
```

クラス名は、productionではハッシュ文字列に置き換わる（例 `.container` → `.a1beca78`）。
これにより、擬似的にスコープを実現する。ハッシュはCSSルール、ファイルパス等から計算されるので、ほぼほぼ衝突しない。
ただし、ハッシュなのでデバッグはめんどくさい。

実際のところ、このサイトの規模くらいだと、CSS Modulesの仕組みにはそれほど不満を感じてはいなかった。
やはり移行の一番の理由は、素のCSSを書く必要があったこと。

## まとめ

CSSに習熟度が低い人や、開発時間がない場合には、Bootstrapなどのフレームワークを使った方が開発は速いと思う。

CSSに多少詳しい人がいる場合は、後々のカスタマイズ性を考えると、Tailwind CSSはすごく良い。
抽象化のレベルが適度と言うか、CSSを必要以上に隠蔽しないし、フレームワークがもたらす依存性・複雑性とも無縁なので。

初速を出すためにBootstrapで始めて、プロダクトが軌道に乗ったら、デザインリニューアル時にTailwind CSSに切り替える、というのが考えられそうなケースかな。
かゆいところに手が届く、といった感想。Tailwind CSSにはトレードオフの選択センスの良さを感じる。

クラスの組み合わせを制限したり抽象度を上げたいときは、独自クラスを簡単に追加できる。
以下は実際に追加した [`.my-link-color`](https://github.com/ybiquitous/homepage/blob/07cbecaafa42d0651f34fad1378991b321f8251e/src/index.css#L16-L18) の例。

```css
@layer utilities {
  .my-link-color {
    @apply text-blue-700;
  }
}
```

CSS in JSはあまり好きになれないので、しばらくはTailwind CSSを使うと思う。
最適化されたCSSを出力できるので、パフォーマンスも良いはず。

以上。
