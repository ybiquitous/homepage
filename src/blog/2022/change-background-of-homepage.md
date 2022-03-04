# ホームページの背景を変えた

最近悲しい出来事があったので、ホームページの背景を変えた。
スマホだと変化が少しわかりにくいかもしれない。

以下、技術的なメモ：

- [`linear-gradient`](https://developer.mozilla.org/docs/Web/CSS/gradient/linear-gradient()) に50%・50%で色を指定することで、単色同士を表現。
- [`background-attachment`](https://developer.mozilla.org/docs/Web/CSS/background-attachment) を使って背景を固定。
- [`backdrop-filter`](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter) を使ってメインコンテンツにぼかしを入れた。
  - Firefoxがまだ実験的サポートなのは意外だった。
