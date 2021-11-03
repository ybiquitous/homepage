# Webpack on Rails

[Webpacker](https://github.com/rails/webpacker) を使わずに、Webpack と Rails を連携させる最低限の方法についての覚え書きです。

Webpacker を使わない理由は、（色々な場所で書かれていますが）Webpack と Rails があまりに密結合な設計だから、と言えば十分でしょう。
Webpack を素の状態で使えるチームであれば、Webpacker という抽象レイヤーはかえって邪魔になります。

この記事では、できるだけ疎結合な形で両者を連携させる方法を説明します。

手っ取り早く試したい方は、この記事で使用したソースコードのサンプルをこちらの[リポジトリ](https://github.com/ybiquitous/webpack-on-rails-example)に置いてますので、ご覧ください（現時点で最新の Rails 6.0.0.rc1 を使用しています）。

## ゴール

この記事のゴールは、[アセットパイプライン](https://guides.rubyonrails.org/asset_pipeline.html)が提供している[主要な機能](https://guides.rubyonrails.org/asset_pipeline.html#main-features)を、[Sprockets](https://github.com/rails/sprockets) を介さずに Webpack で代替することです。つまり、Sprockets と Webpack を結合させない設計にする、ということになります（もちろん Sprockets を使い続けることも可能です）。

ここで、改めてアセットパイプラインが提供する機能を見てみましょう。

1.  アセットの連結
2.  アセットの最小化
3.  高級言語の使用（Sass など）
4.  フィンガープリントの付与（キャッシュの破棄のため）

これらはすべて、Webpack で代替可能です（いくつかの Webpack プラグインが必要になりますが）。しかも「アセットの連結」よりも頑健なモジュールシステム（ES Modules）を使えます。

このゴールを達成するために最低限必要なものは、Webpack が出力したファイルを Rails から参照するためのヘルパーでしょう。もちろん、フィンガープリントを付与しないという選択肢もあり、その場合は単純に `public/` に出力すればいいのですが、現時点でアセットキャッシュの破棄にはフィンガープリントが最も確実で有効な方法でしょう。

さらに、開発者体験（Developer eXperience; DX）を高めるため、この記事では [Webpack DevServer](https://webpack.js.org/configuration/dev-server/) も使うことにします。これにより、コードを更新したらブラウザが自動でリロードされるようになります（この機能のことを [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) と呼びます）。もし DevServer を使わない場合は、ファイル更新の[監視モード](https://webpack.js.org/configuration/watch/)で代用することは可能です。

反対に、この記事でやらないことは gem 化です。こういった Tips は時間とともにすぐに陳腐化しますし、各プロジェクトの事情に応じてカスタマイズしたくなるのが常です。

## プロジェクト構成

通常の Rails ディレクトリとは別に、`frontend/` ディレクトリを作ります。名前は何でもいいのですが、疎結合であることを示すためにディレクトリを分けることが重要です。このあたりは好みですし、`app/frontend/` を作るプロジェクトがあっても構わないと思います。プロジェクトの都合に合わせましょう。

    <project_root>
    ├── app/
    ├── bin/
    ├── config/
    ├── db/
    ├── frontend/             <-- 追加
    ├── lib/
    ├── log/
    ├── node_modules/         <-- `npm install` で自動生成
    ├── public/
    │   └── assets/webpack/   <-- Webpackアセットの出力先
    ├── test/
    ├── vendor/
    ├── Gemfile
    ├── Gemfile.lock
    ├── package-lock.json     <-- `npm install` で自動生成（または yarn.lock)
    ├── package.json
    └── webpack.config.js     <-- 追加

## セットアップ

以下のパッケージが必要になるので、インストールしましょう。

### npm

-   [webpack](https://github.com/webpack/webpack)
-   [webpack-cli](https://github.com/webpack/webpack-cli)
-   [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
-   [webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)

以下のコマンドをターミナルで実行します。

```shell
npm install webpack webpack-cli webpack-dev-server webpack-manifest-plugin --save-dev
```

[Yarn](https://yarnpkg.com/) でもよいです。

```shell
yarn add webpack webpack-cli webpack-dev-server webpack-manifest-plugin --dev
```

### gem

-   [rack-proxy](https://github.com/ncr/rack-proxy)

`Gemfile` を編集し、

```ruby
# Gemfile
group :development, :test do
  gem 'rack-proxy'
end
```

以下のコマンドを実行します。

```shell
bundle install
```

必要なパッケージのインストールは以上です。

## Webpack

npm パッケージをインストールしたら、`npm run` で使えるショートカットコマンドを登録しておきましょう。

`package.json` にエントリを追加します。以下は典型的な例です。

```json
{
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  }
}
```

これで、次のショートカットが使えるようになります。

-   `npm run dev` - DevServer 起動
-   `npm run build` - アセットファイルの出力

次に `webpack.config.js` を作成・編集します。各オプションの詳細については、[ドキュメント](https://webpack.js.org/configuration/)をご覧ください。重要なのは [`output`](https://webpack.js.org/configuration/output/) オプションです。このオプションには Rails の `public/assets/webpack/` ディレクトリを指定します。

以下は設定例です。

```js
// webpack.config.js
const path = require("path");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = (env, argv) => {
  const production = argv.mode === "production";
  const outputPath = path.join(__dirname, "public/assets/webpack/");

  return {
    entry: {
      index: path.join(__dirname, "frontend/src/index.js"),
      // other entries...
    },

    output: {
      path: outputPath,
      publicPath: "/assets/webpack/",
      filename: production ? "[name].[contenthash].js" : "[name].js",
    },

    plugins: [
      new ManifestPlugin({
        fileName: path.join(outputPath, "manifest.json"),
      }),
    ],

    devServer: {
      port: process.env.WEBPACK_DEV_SERVER_PORT || 3100,
      hot: true,
      disableHostCheck: true, // HACK: https://github.com/webpack/webpack-dev-server/issues/1604
    },

    // other settings...
  };
};
```

[`ManifestPlugin`](https://github.com/danethurber/webpack-manifest-plugin) を設定することで、ビルド時に `public/assets/webpack/manifest.json` ファイルが自動生成されます。このマニフェストファイルは Rails 側から参照されます。

マニフェストファイルは以下のようなフォーマットです（`npm run build` 実行時の例）。ファイル名と実際の URL パスのマッピングになっています。また、フィンガープリント用のハッシュダイジェストが付与されています。これは `[contenthash]` という設定によるものです。

```json
{
  "index.js": "/assets/webpack/index.8d398ad66dbe9ac40934.js"
}
```

注意すべきなのは `WEBPACK_DEV_SERVER_PORT` 環境変数を設定している部分です（`devServer.port`）。これは今回独自に追加した変数です。後で Rails 側に Proxy の設定をするときに同じポート番号を指定する必要があるため、環境変数でポート番号を指定するようにします。

デフォルトでは `3100` ポートにしていますが、これは何でも構いません（Rails サーバーのポートと被らなければ）。プロジェクトの都合に合わせて変更しましょう（常に環境変数を設定できる環境であれば、デフォルトのポートはなくても構いません）。

## Rails

Webpack の設定が終わったら、次は Rails の設定です。

まず、Webpack が出力するアセットファイルを Rails から利用するための View ヘルパーを用意します。これはマニフェストファイルを解釈して、パスを解決するためのものです。

```ruby
# app/helpers/webpack_helper.rb
module WebpackHelper
  MANIFEST_PATH = 'assets/webpack/manifest.json'.freeze

  def webpack_script_tag(name)
    content_tag(:script, nil, src: webpack_asset_path(name))
  end

  def webpack_asset_path(name)
    asset_path(webpack_manifest.fetch(name), skip_pipeline: true)
  end

  def webpack_manifest
    if Rails.env.development?
      # Read manifest from Webpack DevServer and disable cache
      JSON.parse(Net::HTTP.get(URI.join(root_url, MANIFEST_PATH)))
    else
      # Read manifest from asset file and enable cache
      @webpack_manifest ||= JSON.parse(Rails.public_path.join(MANIFEST_PATH).read).freeze
    end
  end
end
```

`development` 環境では `http://localhost:3000/assets/webpack/manifest.json` からマニフェストを読み込んでいることに注意してください（`3000` ポートは Rails のデフォルト）。

このマニフェストへの HTTP リクエストは、次に説明する Proxy へ転送されます。反対に、非 `development` 環境ではマニフェストは `public/assets/webpack/manifest.json` ファイルから読み込まれます。

次に、Webpack DevServer へリクエストを転送する Proxy を追加します。ここでは Rack ミドルウェアとして実装します。これは Webpacker の[実装](https://github.com/rails/webpacker/blob/master/lib/webpacker/dev_server_proxy.rb)を参考にしました。`WEBPACK_DEV_SERVER_PORT` 環境変数が再登場していることに注意しましょう。

```ruby
# config/initializers/webpack.rb
if Rails.env.development?
  # See https://github.com/rails/webpacker/blob/master/lib/webpacker/dev_server_proxy.rb
  class WebpackDevServerProxy < Rack::Proxy
    PORT = ENV.fetch('WEBPACK_DEV_SERVER_PORT') { 3100 }
    HOST = "localhost:#{PORT}".freeze
    PROTOCOL = 'http'.freeze
    PATHS = %w[
      /assets/webpack/
      /sockjs-node/
      /__webpack_dev_server__/
    ].freeze

    def perform_request(env)
      if env['PATH_INFO'].start_with?(*PATHS)
        env['HTTP_HOST'] = env['HTTP_X_FORWARDED_HOST'] = env['HTTP_X_FORWARDED_SERVER'] = HOST
        env['HTTP_X_FORWARDED_PROTO'] = env['HTTP_X_FORWARDED_SCHEME'] = PROTOCOL

        super(env)
      else
        @app.call(env)
      end
    end
  end

  # Disable SSL verification for Hot Module Replacement
  Rails.application.config.middleware.insert_before ActionDispatch::Static, WebpackDevServerProxy, ssl_verify_none: true
end
```

なお、忘れずに `public_file_server.enabled` を有効にしておきましょう。これが無効になっていると、本番環境で `/assets/*` へのアクセスが許可されません。

```ruby
# config/environments/production.rb
Rails.application.configure do
  config.public_file_server.enabled = true
end
```

以上で設定は完了です。

## 開発

開発時は `bin/rails s` コマンドと `npm run dev` コマンドを同時に起動しておく必要があります。
別々のターミナルウィンドウを起動してもいいですし、`Procfile` をサポートしたプロセスマネージャ（[`foreman`](http://ddollar.github.io/foreman/) など）を利用してもよいです。

例えば、典型的な `Procfile` はこのようになるでしょう。

    web: bundle exec rails s
    webpack: npm run dev

## ビルド

`npm run build` コマンドを実行すれば、`public/assets/webpack/` ディレクトリにファイルが最小化された状態で出力されます。これらの出力された静的ファイルを、そのままサーバーにデプロイすればよいです。

実際の本番環境では CDN が使われることも多いと思いますが、通常の Rails 設定と同じように `action_controller.asset_host` を設定すれば、それがそのまま Webpack アセットに対しても有効になります。通常の静的ファイルと扱いは同じです。

## まとめ

以上、若干の設定やコードは必要になりますが、Webpacker や Sprockets といった抽象レイヤーを介さずにモダンなフロントエンド環境は構築することができました。

ActiveRecord や MVC フレームワークといった Rails の強力な部分を活用しつつ、Babel・TypeScript・Sass・PostCSS・React・Vue.js といった最新のフロントエンド技術を Webpack を通じて利用することができます。

Webpacker や Sprockets にも良い点はありますが（少なくとも Rails にデフォルトで組み込まれています）、密結合になっているがゆえの柔軟性の欠如が問題になるケースもあります。例えば、以下のようなケースです。

-   最新の Webpack へのアップデートができない。
-   Webpack の設定を `webpack.config.js` ではなく `webpacker.yml` でおこなう必要があり、学習コストが上がる。
-   [`sass-rails`](https://github.com/rails/sass-rails) といった gem が必要で、直接 npm パッケージを使うことができない（またはサポートしてない）。

最終的には、プロジェクトを取り巻く状況に応じたトレードオフの判断を下すことになるかと思います。この記事がその判断の一助になれば幸いです。

---

*2021-11-03 updated*: 「Table of Contents」と重複するため「目次」セクションを削除。
