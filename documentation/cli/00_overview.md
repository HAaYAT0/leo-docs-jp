---
id: cli_overview
title: Leo コマンドラインインターフェース
sidebar_label: 概要
slug: /cli_overview
---
[general tags]: # (cli)

Leo CLI は、Leo コンパイラと連携して動作するコマンドラインツール群です。

:::tip
`leo --help` を実行すると利用可能なコマンド一覧を確認できます。
:::

## コマンド一覧

* [`account`](./01_account.md) - Aleo アカウントの作成・署名・検証を行います。
  * [`new`](./01_account.md#leo-account-new) - 新しい Aleo アカウントを生成します。
  * [`import`](./01_account.md#leo-account-import) - 秘密鍵から Aleo アカウントを復元します。
  * [`sign`](./01_account.md#leo-account-sign) - Aleo 秘密鍵でメッセージに署名します。
  * [`verify`](./01_account.md#leo-account-verify) - Aleo アドレスの署名を検証します。
* [`add`](./02_add.md) - プロジェクトにオンチェーンまたはローカル依存関係を追加します。
* [`build`](./03_build.md) - 現在のプロジェクトをコンパイルします。
* [`clean`](./04_clean.md) - ビルド成果物をクリーンアップします。
* [`debug`](./05_debug.md) - 対話型デバッガーを起動します。
* [`deploy`](./06_deploy.md) - プログラムを Aleo ネットワークへデプロイします。
* [`devnet`](./07_devnet.md) - ローカル Devnet を初期化します。
* [`execute`](./08_execute.md) - プログラムを実行し、証明付きトランザクションを生成します。
* [`new`](./09_new.md) - 新しい Leo プロジェクトを作成します。
* [`query`](./10_query.md) - Aleo ネットワーク上の最新データを取得します。
  * [`block`](./10_query.md#leo-query-block) - ブロック情報を取得します。
  * [`transaction`](./10_query.md#leo-query-transaction) - トランザクション情報を取得します。
  * [`program`](./10_query.md#leo-query-program) - プログラムのソースとマッピングを取得します。
  * [`stateroot`](./10_query.md#leo-query-stateroot) - 最新のステートルートを取得します。
  * [`committee`](./10_query.md#leo-query-committee) - 現在のバリデータ委員会を取得します。
  * [`mempool`](./10_query.md#leo-query-mempool) - メモリプール内のトランザクションと送信データを取得します。
  * [`peers`](./10_query.md#leo-query-peers) - ピア情報を取得します。
* [`remove`](./11_remove.md) - プロジェクトから依存関係を削除します。
* [`run`](./12_run.md) - 証明を生成せずにプログラムを実行します。
* [`test`](./13_test.md) - プロジェクトのテストケースを実行します。
* [`update`](./14_update.md) - Leo を最新バージョンに更新します。
* [`upgrade`](./15_upgrade.md) - Aleo ネットワーク上にデプロイ済みのプログラムをアップグレードします。

## 共通フラグ
Leo CLI のすべてのコマンドで利用できる汎用フラグです。

#### `-h`
#### `--help`
利用可能なコマンドとフラグの一覧を表示します。

#### `-V`
#### `--version`
現在インストールされている Leo のバージョンを表示します。

#### `-q`
CLI の出力を抑制します。

#### `-d`
可能であればデバッグ用の追加情報を表示します。

#### `--path <PATH>`
Leo プログラムのルートフォルダへのパスを指定します。デフォルトは `./` です。

#### `--home <HOME>`  
`.aleo` プログラムレジストリへのパスを指定します。ネットワークから取得したプログラムはここにキャッシュされます。デフォルトは `~/.aleo/registry` です。
