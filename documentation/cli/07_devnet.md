---
id: cli_devnet
title: ""
sidebar_label: Devnet
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_devnet, devnet local_devnet, snarkos)

# `leo devnet`

ローカル Devnet を初期化するには次を実行します。
```bash
leo devnet --snarkos <SNARKOS>
```
`<SNARKOS>` にはインストール済み snarkOS バイナリへのパスを指定します。

snarkOS が未インストールの場合は `--install` フラグを付けることで、上記パスにバイナリをインストールできます。

<!-- markdown-link-check-disable -->
:::info
ローカル Devnet の既定の ENDPOINT は `http://localhost:3030` です。
:::
<!-- markdown-link-check-enable -->

### Flags:
#### `--snarkos <SNARKOS>`
使用する snarkOS バイナリへのパスを指定します。

:::info
必須のフラグです。
:::

#### `--snarkos-features <FEATURES>`
有効化する snarkOS の機能を指定します（例: `test_network`）。

#### `--install`
指定した `--snarkos` パスに snarkOS をインストール（または再インストール）します。`--snarkos-features` で機能も合わせて指定できます。
<!-- markdown-link-check-disable -->
#### `--snarkos-version <SNARKOS_VERSION>`
利用またはインストールする snarkOS のバージョンを指定します。既定では [crates.io](https://crates.io/crates/snarkos) 上の最新バージョンが選択されます。
<!-- markdown-link-check-enable -->
#### `--consensus-heights <CONSENSUS_HEIGHTS> `
各コンセンサスアップグレードを適用するブロック高を任意で指定します。このオプションを使う場合は `--snarkos-features test_network` も有効化してください。

```bash
--consensus-heights 0,1,2,3....
```
上記例ではブロック 0 で Consensus_V0、ブロック 1 で Consensus_V1…を有効化します。

#### `--storage <STORAGE>`
snarkOS の台帳やログを保存するルートディレクトリを指定します（既定は `./`）。

#### `--clear-storage`
Devnet を起動する前に既存の snarkOS 台帳を削除します。


#### `--network <NETWORK_ID>`
Devnet のネットワーク ID を指定します。

| ID |  Network  |
|:---------:|:------:|
| 0  | Mainnet | 
| 1  | Testnet (default)| 
| 2  | Canary | 

#### `--tmux`
tmux 上で Devnet ノードを起動します（Unix 系 OS のみ利用可）。

#### `--num-validators <NUM_VALIDATORS>`
snarkOS で起動するバリデータ数を指定します（既定は 4）。

#### `--num-clients <NUM_CLIENTS>`
snarkOS で起動するクライアント数を指定します（既定は 2）。

#### `--verbosity <VERBOSITY>`
snarkOS のログ詳細度を 0〜4 の範囲で指定します（既定は 1）。
