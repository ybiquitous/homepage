---
published: 2021-09-07T00:00:00.000Z
lastUpdated: null
author: Masafumi Koba
tags: docker
---

# Dockerfileのベストプラクティスが変わった話

昨日Twitterで面白い記事が流れてきたので、気になって読んでみた。

記事のタイトルは『[The worst so-called “best practice” for Docker](https://pythonspeed.com/articles/security-updates-in-docker/)』。
日本語だと『Docker最悪のいわゆる“ベストプラクティス”』。

この記事を書いた人がDockerドキュメントの「[ベストプラクティス](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run)」を説明したページのある箇所に対して、修正リクエストをした（マージ済み）。
修正プルリクエスト [docker/docker.github.io#12571](https://github.com/docker/docker.github.io/pull/12571) を見ればわかるように、

> Avoid `RUN apt-get upgrade` and `dist-upgrade`, ...

の一節をまるっと削除している。

つまり、`apt-get upgrade` は脆弱性やら致命的なバグやらを修正してくれるコマンドなんだから、それを「Avoid（避けろ）」というプラクティスはおかしいだろうと。

このDockerウェブサイトに加えて、[OWASPウェブサイト](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html#rule-11-lint-the-dockerfile-at-build-time)や[hadolintのルール](https://github.com/hadolint/hadolint/wiki/DL3005)も修正している。
（hadolintはDockerfileリンターの1つ）

件の記事で著者は、`RUN apt-get upgrade` できる理由をいくつか上げている。まあ、おおむね納得できる。
むしろ、本番で使用するDockerイメージにはすべて、この `RUN apt-get upgrade` を適用しておくべきなんじゃないか、という気もしてくる。

ここで1つ疑問が生じる。「パッケージバージョンを固定（pin）しておかないと、ビルドが不安定になるのでは？」

これはありえる話だ。ある日突然、アプリケーションのビルドが `apt-get upgrade` によって壊れるかもしれないのだ。
かといって、バージョンを固定すればセキュリティアップデートを適用できなくなるので、悩ましい。
また、`apt-get upgrade` を毎回実行すると、ビルドが少し遅くなるかもしれないし、キャッシュも効かなくなる。

固定したバージョンを定期的に書き換えてくれる仕組みがあるとよさそうだが、Dockerfile内の `RUN` を解析するのは難しそう。
仕組みが無いかぎり、一度固定したらアップデートを忘れるのは容易に想像できる。

自分の中で結論は出てない。「〜を避けよ」というプラクティスを削除したがために、ユーザとしては迷い（選択の余地）が生じる。
今回の件で、「ベストプラクティス」は意外と簡単に変わるものだと学んだ。

ベストプラクティスって、思考停止して権威によって決定を下せるから楽っちゃ楽なんだけど、その権威があっさり揺らぐことが普通に起きうるので、
ちゃんと自分の頭で考えましょう、ということに結局はなるのかな。

技術って知るべきことが多すぎるので、ベストプラクティスに頼りたくなるのも理解はできるんだけど。あ~難しい。
