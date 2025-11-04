---
id: devnet 
title: Devnet を動かす
sidebar_label: Devnet
---
[general tags]: # (guides, devnet local_devnet, snarkos)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

ローカル Devnet は構築に手間はかかりますが、Aleo 上でアプリケーションを確実にテストできる手段です。

## セットアップ

Leo CLI にはローカル Devnet を起動するためのコマンドがあります。
```bash
leo devnet --snarkos <SNARKOS>
```
`<SNARKOS>` には [**snarkOS**](https://github.com/ProvableHQ/snarkOS)（Aleo ネットワークを支える分散 OS）のバイナリへのパスを指定します。

snarkOS をまだインストールしていない場合は `--install` フラグを付けると、指定した `<SNARKOS>` のパスにバイナリを自動でダウンロード・ビルド・保存します。
```bash
leo devnet --snarkos <SNARKOS> --install
```
:::info

Windows ユーザーが snarkOS を正しくインストールするには、追加の手順が必要です。
1. Rust をインストールするときに、MSVC 2022 C++ ビルドツール付きの Visual Studio のインストールが自動的に提案されたはずです。
2. Visual Studio Installer を開き、Windows 向け C++ Clang Compiler と Windows 10 SDK または Windows 11 SDK（OS に応じて）をインストールします。インストールパスは `{PATH}\Microsoft Visual Studio\2022\BuildTools` のようになります。
3. 上記ビルドツールのディレクトリ内にある `libclang.dll` の場所を確認します。`x86` システムでは `VC\Tools\Llvm\bin`、`x64` システムでは `VC\Tools\Llvm\x64\bin` に配置されています。
4. `libclang.dll` のフルパスが分かったら、システム環境変数 `LIBCLANG_PATH` を作成し、そのパスを設定します。
5. これで snarkOS をコンパイル・実行できるようになります。

:::




`tmux` を使用すると、ローカル Devnet 内のノードを切り替えながら操作できます。起動時に `--tmux` フラグを付けて有効化してください。
```bash
leo devnet --snarkos <SNARKOS> --tmux
```
:::info
この機能は Unix 系 OS でのみ利用できます。
:::

あらかじめ `tmux` パッケージをインストールしておきましょう。

<Tabs defaultValue="cargo"
values={[
  { label: 'MacOS', value: 'macos' },
  { label: 'Ubuntu', value: 'ubuntu' },
]}>
<TabItem value="macos">

macOS では Homebrew パッケージマネージャーを使って `tmux` をインストールできます。Homebrew をインストールしていない場合は [公式サイト](https://brew.sh/) を参照してください。Homebrew が入ったら以下を実行します。
```bash
brew install tmux
```
</TabItem>
<TabItem value="ubuntu">
Ubuntu などの Debian 系ディストリビューションでは、apt パッケージマネージャーを利用します。

```bash
sudo apt update
sudo apt install tmux
```
</TabItem>
</Tabs>

`tmux` で Devnet を操作する際によく使うコマンドは次のとおりです。
```bash
# 次のノードへ切り替える
Ctrl+b n 
# 前のノードへ切り替える
Ctrl+b p 
# スクロールを開始（q で終了）
Ctrl+b q
# ノード一覧から選択する
Ctrl+b w 
# 指定したノードを選択する
Ctrl+b :select-window -t {NODE_ID}
# Devnet を停止する
Ctrl+b :kill-session
```

`leo devnet` コマンドの詳細は [こちら](./../cli/07_devnet.md) を参照してください。



## 利用方法

チェーンを停止して再起動すると、既存の状態や履歴が保持されます。履歴を消去したい場合は `--clear-storage` フラグを付けて起動します。
```bash
leo devnet --snarkos <SNARKOS> --clear-storage
```
レジャーをクリアすると、プログラム名を変えずに再度デプロイしたい場合に便利ですが、トランザクション履歴はすべて消去され、ジェネシスから新しいチェーンが開始されます。



## デプロイと実行

ローカル Devnet 上でプログラムをデプロイ／実行する際は、エンドポイントを外部 API ではなく `http://localhost:3030` に設定してください。これは `ENDPOINT` 環境変数を設定するか、CLI で `--endpoint http://localhost:3030` フラグを指定するか、Leo プロジェクトの `.env` に `ENDPOINT` を記載することで設定できます。

Devnet でトランザクションを実行するにはクレジットが必要です。snarkOS はテスト用の Aleo クレジットが入った開発者アカウントを 4 つ自動で作成します。
```bash
# Account 0
APrivateKey1zkp8CZNn3yeCseEtxuVPbDCwSyhGW6yZKUYKfgXmcpoGPWH
AViewKey1mSnpFFC8Mj4fXbK5YiWgZ3mjiV8CxA79bYNa8ymUpTrw
aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px

# Account 1
APrivateKey1zkp2RWGDcde3efb89rjhME1VYA8QMxcxep5DShNBR6n8Yjh
AViewKey1pTzjTxeAYuDpACpz2k72xQoVXvfY4bJHrjeAQp6Ywe5g
aleo1s3ws5tra87fjycnjrwsjcrnw2qxr8jfqqdugnf0xzqqw29q9m5pqem2u4t

# Account 2
APrivateKey1zkp2GUmKbVsuc1NSj28pa1WTQuZaK5f1DQJAT6vPcHyWokG
AViewKey1u2X98p6HDbsv36ZQRL3RgxgiqYFr4dFzciMiZCB3MY7A
aleo1ashyu96tjwe63u0gtnnv8z5lhapdu4l5pjsl2kha7fv7hvz2eqxs5dz0rg

# Account 3
APrivateKey1zkpBjpEgLo4arVUkQmcLdKQMiAKGaHAQVVwmF8HQby8vdYs
AViewKey1iKKSsdnatHcm27goNC7SJxhqQrma1zkq91dfwBdxiADq
aleo12ux3gdauck0v60westgcpqj7v8rrcr3v346e4jtq04q7kkt22czsh808v2
```
使用する秘密鍵は、`PRIVATE_KEY` 環境変数を手動で設定するか、CLI に `--private-key` フラグで直接渡すか、プロジェクトの `.env` に `PRIVATE_KEY` を記載することで指定できます。

秘密鍵とエンドポイントを正しく設定すれば、デプロイや実行の流れは Testnet や Mainnet とほぼ同じです。詳細は [**デプロイ**](./03_deploying.md) と [**実行**](./04_executing.md) の各ガイドを参照してください。



## トランザクションステータスの確認

トランザクションの状況は次の API エンドポイントで確認できます。

```bash
GET http://localhost:3030/testnet/transaction/{TRANSACTION_ID}
```

または CLI から `leo query` を使って確認することも可能です。

```bash
leo query transaction {TRANSACTION_ID}
```

トランザクション API は成功・失敗を確認するのに便利です。成功・失敗のどちらでも手数料トランザクションが生成されるため、手数料のみが表示される場合はトランザクションが失敗したことを意味します。なお Testnet と Mainnet では、失敗したトランザクションでもネットワークが計算を行うため手数料が必要です。

利用可能な API エンドポイントの一覧は [こちら](https://developer.aleo.org/apis/provable-api)。

## レコードスキャン

インストール済み snarkOS のバイナリを使って、保有レコードをスキャンできます。まずはバイナリをインストールしたディレクトリへ移動し、次の形式でコマンドを実行してください。
```bash
./snarkos developer scan --endpoint http://localhost:3030 --private-key {YOUR_PRIVATE_KEY} --start <block_number> --network 1
```

`block_number` に `0` を指定すると、ジェネシスブロック以降に作成されたすべてのレコード（テストクレジットのレコードを含む）が表示されます。

```bash title="sample output:"
⚠️  Attention - Scanning the entire chain. This may take a while...

Scanning 3 blocks for records (100% complete)...   

[
  "{  owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,  microcredits: 23437500000000u64.private,  _nonce: 3666670146276262240199958044811329632452609778779651964870759629195088099828group.public}",
  "{  owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,  microcredits: 23437500000000u64.private,  _nonce: 4536868268814456227312360347031739423312689137706933033938812386306238998060group.public}",
  "{  owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,  microcredits: 23437500000000u64.private,  _nonce: 205967862164714901379497326815256981526025583494109091059194305832749867953group.public}",
  "{  owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,  microcredits: 23437500000000u64.private,  _nonce: 4424806931746512507605174575961455750579179367541686805196254590136284583805group.public}"
]
```

`block_number` を `1` 以上にすると、上記のクレジットレコードはスキャン対象から除外されます。
