# ECS Deploy via GitHub Actions

最近会社のRailsアプリのECSデプロイをAWS CodeBuildからGitHub Actionsに移行したので、その備忘録。
動機は以下のとおり。

- AWS側にGitHubリポジトリのアクセストークンを渡す必要がなくなる
  （AWSのクレデンシャルをGitHub Actionsのsecretsに登録する必要あるけど）
- デプロイ設定のコードをアプリのリポジトリで管理できる

## TL;DR

Docker、AWSの公式Actionsを駆使する。AWS CLIやECS CLIは**使わない**。

- [docker/build-push-action](https://github.com/docker/build-push-action) でビルド
- [aws-actions/amazon-ecr-login](https://github.com/aws-actions/amazon-ecr-login) で[ECR](https://aws.amazon.com/ecr/)にプッシュ
- [aws-actions/amazon-ecs-deploy-task-definition](https://github.com/aws-actions/amazon-ecs-deploy-task-definition) でECSにデプロイ

## Example

実際はSlack通知とかも入ってるが、エッセンスを抜き出すとこんな感じ ⬇️

```yaml
name: Deploy

on:
  push:
    branches: ["main"]

# 必ず1つのjobだけが実行されるようにする（1 concurrency per branch）
concurrency: "${{ github.ref }}"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # ECRイメージタグをセット
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID_FOR_DEPLOY }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY_FOR_DEPLOY }}
          aws-region: ${{ secrets.AWS_REGION_FOR_DEPLOY }}
      - uses: aws-actions/amazon-ecr-login@v1
        id: login-ecr
      - run: echo "::set-output name=value::${ECR_REGISTRY}/${ECR_REPOSITORY}:${GITHUB_SHA}"
        id: image-tag
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: my-ecr-repo

      # ビルド＆プッシュ
      - uses: docker/setup-buildx-action@v1
      - uses: docker/build-push-action@v2
        with:
          push: true
          tags: ${{ steps.image-tag.outputs.value }}

      # デプロイ（web）
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ecs/task-definition-web.json
          cluster: my-cluster
          service: my-service-web
          wait-for-service-stability: true

      # デプロイ（worker）
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ecs/task-definition-worker.json
          cluster: my-cluster
          service: my-service-web
          wait-for-service-stability: true

      # one-offタスク用に登録だけする
      - uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ecs/task-definition-oneoff.json
          cluster: my-cluster
```

web/worker/one-offの3つをデプロイしているのがポイント。

一番めんどくさいのがTask Definition JSONファイルを用意すること。AWSのドキュメントとにらめっこしながら設定した。

staticなファイルを用意するのが簡明だが、production/stagingのように似た環境向けにいくつもファイルを用意するのはDRYではないかもしれない。
そういう場合は、何らかのテンプレートエンジンを使って、JSONファイルを出力するヘルパースクリプトが必要になるだろう。これはプロジェクトによる。

## Conclusion

それぞれの公式のActionを組み合わせていく感覚で構築できる。面倒なのがTask Definitionファイルの準備だが、
JSONファイルを生成するスクリプトはRubyで比較的簡単に書けるし、変にツールで抽象化を増やすよりは簡明だと思っている。

こういった方法はすぐに陳腐化しやすので、あくまで2021年9月時点の話であることを忘れずに。

## See also

- [Workflow syntax for GitHub Actions - GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions)
- [Creating a task definition - Amazon Elastic Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition.html)
- [Task definition parameters - Amazon Elastic Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
