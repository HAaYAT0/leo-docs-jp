---
id: dependencies 
title: 依存関係の管理
sidebar_label: 依存関係の管理
---
[general tags]: # (guides, dependency, dependency_management, imports, program)

## Leo のインポート
`main.leo` では、プログラム定義より前に `import` キーワードを使って依存関係を宣言します。
```leo
import credits.aleo;

program test.aleo {
...
}
```

Leo プログラムのルートディレクトリで `leo add` コマンドを実行すると、`program.json` マニフェストに依存関係が追加されます。

## デプロイ済みプログラム
`credits.aleo` のようなデプロイ済みプログラムを依存関係として追加する場合は、次のコマンドを使用します。

```
leo add credits.aleo
```
または
```
leo add credits
```

Mainnet 向けにデプロイする場合は、以下のように `--network` フラグで対象ネットワークを指定してください。

```
leo add credits --network mainnet
```

最初の依存関係を追加すると、`program.json` マニフェストに `dependencies` フィールドが新たに作成されます。

```json
{
  "program": "your_program.aleo",
  "version": "0.0.0",
  "description": "",
  "license": "MIT",
  "dependencies": [
    {
      "name": "credits.aleo",
      "location": "network",
      "network": "testnet",
      "path": null
    }
  ]
}
```

依存関係を削除するには `leo remove` コマンドを使用します。
```bash
leo remove credits.aleo
```

## ローカル開発
ローカル Devnet 向けにデプロイする場合は、依存関係のパスを次のように指定します。

```
leo add program_name.aleo --local ./path_to_dependency
```
この場合、`program.json` の `dependencies` セクションにはパス情報が含まれます。
```json
{
  "program": "your_program.aleo",
  "version": "0.0.0",
  "description": "",
  "license": "MIT",
  "dependencies": [
    {
      "name": "local_dependency.aleo",
      "location": "local",
      "network": null,
      "path": "./path"
    }
  ]
} 
```

## 再帰的なデプロイ
ローカル依存を含むプログラムをデプロイする場合は、次のコマンドを使用します。
```bash
leo deploy --recursive
```
すべてのローカル依存が順番にデプロイされ、その後にメインプログラムが続きます。すでにデプロイ済みの依存関係はスキップされます。
