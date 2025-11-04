---
id: cli_add
title: ""
sidebar_label: Add 
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_add, add_dependency, dependency, dependency_management, imports)

# `leo add`

`leo add` コマンドは、現在の Leo プロジェクトにオンチェーンまたはローカルの依存関係を追加します。

ローカルの依存関係を追加する場合:
```bash
leo add --local <LOCAL> <NAME>
```
`<NAME>` には追加するプログラム名、`<LOCAL>` にはローカルプロジェクトへのパスを指定します。

&nbsp;

既にオンチェーンにデプロイされているプログラムを依存関係として追加する場合:
```bash
leo add --network <NAME>
```
`<NAME>` は取り込むプログラム名を指定します。

### Flags:
#### `--local <LOCAL> `
#### `-l <LOCAL>`
追加する依存関係がローカルに存在するプログラムであることを示します。`<LOCAL>` は Leo プロジェクトのルートディレクトリ、またはコンパイル済み `.aleo` ファイルへのパスを指定できます。


#### `--network`
#### `-n `
オンチェーンにデプロイ済みのリモートプログラムを依存関係として取得します。どのネットワークから取得するかは `.env` の `NETWORK` 変数で定義された値に従います。


#### `--edition <EDITION> `
#### `-e <EDITION>`
取得するプログラムのエディションを指定します。このフラグのみを指定した場合、ネットワークからの取得が前提となります。

:::warning
用途を理解している場合のみ使用してください。
:::


#### `--dev`
追加するプログラムを開発用依存関係として扱います。本番環境では利用しない前提です。


#### `-c`
#### `--clear`
既存の依存関係をすべて削除します。

:::warning
この機能には既知の不具合があり、現在は正常に動作しません。
:::
