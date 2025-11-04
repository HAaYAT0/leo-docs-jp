---
id: installation
title: インストール
sidebar: インストール
slug: /installation
toc_min_heading_level: 5
toc_max_heading_level: 5
---
[general tags]: # (installation, install_leo)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

利用しているプラットフォームや好みに応じて、Leo をインストールする方法はいくつかあります。使いやすい手段を選んでください。

ローカル環境へインストールせずに試したい場合は、[Leo Playground](./02_ide.md#leo-playground) をご覧ください。

<Tabs defaultValue="cargo"
values={[
  { label: 'Cargo', value: 'cargo' },
  { label: 'Pre-Built Binaries', value: 'prebuilt' },
  { label: 'Build from Source', value: 'source' },
]}>
<TabItem value="cargo">

## Cargo でインストール
最も簡単な方法は、[Rust](https://www.rust-lang.org/tools/install) の最新安定版をインストールして Cargo を利用することです。

## Leo をインストール
```bash
cargo install leo-lang
```
インストールが完了すると、`~/.cargo/bin/leo` に実行ファイルが生成されます。
</TabItem>
<TabItem value="prebuilt">

## macOS（Apple Silicon）
  1. **[Apple Silicon 向けの Leo (macOS)](https://github.com/ProvableHQ/leo/releases/latest/download/leo.zip)** をダウンロード
  2. ダウンロードした `.zip` ファイルを展開
  3. ターミナルを開き、展開したディレクトリに移動
  4. `chmod +x leo` を実行して実行可能にする
  5. `leo` を `/usr/local/bin` に移動するとシステム全体で利用できます

          mv leo /usr/local/bin

  6. `leo --version` を実行してインストールを確認

## その他のプラットフォーム
  - **[Leo の全リリース一覧](https://github.com/ProvableHQ/leo/releases)** を参照してください

</TabItem>
<TabItem value="source">

## Rust のインストール
**[Rust](https://www.rust-lang.org/tools/install)** の最新安定版をインストールします。インストール後、次のコマンドで確認できます。
```bash
cargo --version
```

## Git のインストール
**[Git](https://git-scm.com/downloads)** の最新バージョンをインストールします。インストール後、次のコマンドで確認できます。
```bash
git --version
```

## ソースコードから Leo をビルド
```bash
# ソースコードを取得
git clone https://github.com/ProvableHQ/leo
cd leo
# ビルドしてインストール
cargo install --path .
```
インストールが完了すると、`~/.cargo/bin/leo` に実行ファイルが生成されます。

#### Leo を使う
```bash
leo
```
</TabItem>
</Tabs>
