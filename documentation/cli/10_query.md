---
id: cli_query
title: ""
sidebar_label: Query
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_query, query, block, transaction, program, stateroot, committee, mempool, peers, snarkOS, mapping)

# `leo query`

`leo query` コマンドは、標準的な `snarkOS` エンドポイントを提供するネットワークからデータを取得します。


# Subcommands
* [`block`](#leo-query-block) - ブロック情報を取得します。
* [`transaction`](#leo-query-transaction) - トランザクション情報を取得します。
* [`program`](#leo-query-program) - プログラムのソースコードやマッピング値を取得します。
* [`stateroot`](#leo-query-stateroot) - 最新のステートルートを取得します。
* [`committee`](#leo-query-committee) - 現在のバリデータ委員会を取得します。
* [`mempool`](#leo-query-mempool) - メモリプール内のトランザクションや送信情報を取得します。
* [`peers`](#leo-query-peers) - ピア情報を取得します。

&nbsp;

---


## `leo query block`

ネットワークからブロックを取得するには次を実行します。
```bash
leo query block <ID>
```
`<ID>` にはブロック高またはブロックハッシュを指定します。結果は JSON 形式で返されます。

たとえば Mainnet のジェネシスブロックは次のいずれかで取得できます。
```bash
leo query block 0 --network mainnet --endpoint https://api.explorer.provable.com/v1
```
```bash
leo query block ab1sm6kyqle2ftg4z8gegafqrjy0jwjhzu6fmy73726dgszrtxhxvfqha0eee --network mainnet --endpoint https://api.explorer.provable.com/v1
```



### Flags:

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。


#### `--latest`
#### `-l`
最新ブロックを取得します。

```bash title="Example:"
leo query block --latest
```


#### `--latest-hash`
最新ブロックのハッシュだけを取得します。

```bash title="Example:"
leo query block --latest-hash
```


#### `--latest-height`
最新ブロックの高さを取得します。

```bash title="Example:"
leo query block --latest-height
```

#### `--range <START_HEIGHT> <END_HEIGHT>`
#### `-r <START_HEIGHT> <END_HEIGHT>`
最大 50 個までの連続したブロックを取得します。

```bash title="Example:"
leo query block --range <START_HEIGHT> <END_HEIGHT>
```


#### `--transactions`
#### `-t`
指定したブロック高に含まれるトランザクションを取得します。
```bash title="Example:"
leo query block <BLOCK_HEIGHT> --transactions
```


#### `--to-height`
指定したブロックハッシュに対応するブロック高を取得します。
```bash title="Example:"
leo query block <BLOCK_HASH> --to-height
```

---

## `leo query transaction`

特定のトランザクションを取得するには次を実行します。

```bash
leo query transaction <ID>
```
`<ID>` はトランザクション ID です。結果は JSON 形式で返されます。

### Flags:

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。


#### `--confirmed`
#### `-c`
トランザクションが確定している場合、オンチェーン実行結果を含む詳細を返します。


#### `--unconfirmed`
#### `-u`
未確定（オリジナル）トランザクションを取得します。


#### `--from-io <INPUT_OR_OUTPUT_ID>`
指定した入出力 ID が含まれるトランザクション ID を取得します。
```bash title="Example:"
leo query transaction --from-io <INPUT_OR_OUTPUT_ID>
```


#### `--from-transition <TRANSITION_ID>`
指定したトランジションを含むトランザクション ID を取得します。

```bash title="Example:"
leo query transaction --from-transition <TRANSITION_ID>
```


#### `--from-program <PROGRAM_NAME>`
指定したプログラムがデプロイされたトランザクション ID を取得します。
```bash title="Example:"
leo query transaction --from-program <PROGRAM_NAME>
```

---

## `leo query program`

特定のプログラム情報を取得するには次を実行します。

```bash
leo query program <PROGRAM_NAME>
```

マッピングやその値を問い合わせることも可能です。例えば Aleo クレジットの公開残高を確認する場合:

```bash
leo query program credits.aleo --mapping-value account <YOUR_ADDRESS>
```


### Flags:

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。


#### `--mappings`
最新エディションのプログラムに定義されているマッピング一覧を表示します。


#### `--mapping-value <MAPPING> <KEY> `
指定したマッピングとキーに対応する値を取得します。存在しない場合は `null` を返します。

#### `--edition <EDITION>`
プログラムのソース取得時に使用するエディションを指定します。省略した場合は最新エディションが利用されます。

プログラムは初回デプロイ時にエディション `0` が付与され、アップグレードのたびに `1` ずつ増加します。詳細は **[Upgrading Programs](./../guides/10_program_upgradability.md)** を参照してください。


---

## `leo query stateroot`

指定したネットワークの最新ステートルートを取得します。

### Flags:

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。

---

## `leo query committee`

指定したネットワークの現在のバリデータ委員会を取得します。

### Flags:

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。

---

## `leo query mempool`

指定したネットワーク上のノードで、メモリプールのトランザクションや送信情報を取得します。

:::note
このコマンドはカスタムエンドポイントでのみ実行できます。Provable 公式 API エンドポイントでは動作しません。
:::

トランザクションを問い合わせる場合:
```bash
leo query mempool --transactions
```

送信情報を問い合わせる場合:
```bash
leo query mempool --transmissions
```


### Flags:

#### `--transactions`
メモリプール内のトランザクション一覧を取得します。


#### `--transmissions`
メモリプール内の送信（transmission）情報を取得します。


#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。

---

## `leo query peers`

指定したネットワーク上のノードからピア情報を取得します。

:::note
このコマンドもカスタムエンドポイントでのみ実行できます。Provable 公式 API エンドポイントでは動作しません。
:::

### Flags:

#### `--metrics`
#### `-m`          
参加ピアのメトリクスを取得します。


#### `--count`
#### `-c`             
参加ピアの総数を取得します。

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続するエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数より優先されます。
