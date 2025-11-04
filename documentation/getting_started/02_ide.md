---
id: ide
title: 開発環境を整える
sidebar_label: 開発環境
---
[general tags]: # (playground, ide, plugin)

開発者はニーズに合わせてさまざまな開発環境を選択できます。

## Leo Playground

[Leo Playground](https://play.leo-lang.org) はブラウザだけで開発・デプロイ・実行までこなせる Web ベースの IDE です。エディタや GitHub 連携に加えて、プログラム管理やネットワーク連携に役立つユーティリティが揃っています。

![Leo Playground](./../img/leo-playground.png)

:::note
ブラウザ上ではトランザクション生成がやや遅く感じられるかもしれません。これは証明生成アルゴリズムが計算負荷の高い処理であるためです。引き続き改善に取り組んでいます。
:::

## プラグイン

<!--TODO: Condense this.--->

Leo チームは複数のエディタ向けに公式プラグインを提供しています。ここに記載のないエディタをお使いの場合は、[GitHub](https://github.com/ProvableHQ/leo/issues/new) でリクエストしてください。


### VS Code

[//]: # (![]&#40;./images/vscode.png&#41;)
エディタ本体のダウンロード: https://code.visualstudio.com/download

#### インストール

1. VSCode Marketplace から [Leo for VSCode](https://marketplace.visualstudio.com/items?itemName=aleohq.leo-extension) をインストールします。
2. 正しい拡張機能 ID は `aleohq.leo-extension` で、説明欄に「the official VSCode extension for Leo」と記載されています。

#### 使い方

1. `VSCode` を開きます。
2. Settings > Extensions もしくは左側パネルの Extensions ボタンから Leo プラグインを有効化します。


### Sublime Text

[//]: # (![]&#40;./images/sublime.png&#41;  )
エディタ本体のダウンロード: https://www.sublimetext.com/download  
Sublime の LSP プラグイン経由で Aleo 命令のサポートを提供しています。

#### インストール

1. Package Control から [LSP](https://packagecontrol.io/packages/LSP) と [LSP-leo](https://packagecontrol.io/packages/LSP-leo) をインストールします。
2. Sublime を再起動します。

#### 使い方

以下の手順で `Leo` のシンタックスハイライトやホバー、トークン表示を切り替えます。

1. `Sublime Text` を開きます。
2. Settings > Select Color Scheme... > LSP-leo を選択します。


### IntelliJ

[//]: # (![]&#40;./images/intellij.png&#41;)
エディタ本体のダウンロード: https://www.jetbrains.com/idea/download/

#### インストール

1. IDE 上で [Leo プラグイン](https://plugins.jetbrains.com/plugin/19979-leo) をインストールし、有効化します。
