---
id: cli_execute
title: ""
sidebar_label: Execute
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_execute, execute, execution, transaction, transition, transaction_status, async_transition)

# `leo execute`

`leo execute` は `transition` もしくは `async transition` 関数を実行し、証明付きトランザクションを生成して（必要に応じて）ネットワークへブロードキャストします。証明やトランザクションを生成しない `leo run` とは挙動が異なります。

コマンドラインから入力を与えて実行する場合:
```bash
leo execute <TRANSITION_NAME> <INPUTS>
```
`<TRANSITION_NAME>` は実行したい `transition`／`async transition` の名前、`<INPUTS>` はスペース区切りで列挙した入力値です。

:::note
このコマンドを実行するには、残高のあるアカウントが必要です。
:::

内部的には、プログラムの回路を合成し、証明鍵・検証鍵を生成します。


```bash title="sample output:"
       Leo     ... statements before dead code elimination.
       Leo     ... statements after dead code elimination.
       Leo     The program checksum is: '[...]'.
       Leo ✅ Compiled '{PROGRAM_NAME}.aleo' into Aleo instructions.

📢 Using the following consensus heights: 0,2950000,4800000,6625000,6765000,7600000,8365000,9173000,9800000
  To override, pass in `--consensus-heights` or override the environment variable `CONSENSUS_VERSION_HEIGHTS`.

Attempting to determine the consensus version from the latest block height at {ENDPOINT}...

🚀 Execution Plan Summary
──────────────────────────────────────────────
🔧 Configuration:
  Private Key:        {PRIVATE_KEY}
  Address:            {ADDRESS}
  Endpoint:           {ENDPOINT}
  Network:            {NETWORK}
  Consensus Version:  {CONSENSUS_VERSION}

🎯 Execution Target:
  Program:        {PROGRAM_NAME}.aleo
  Function:       {FUNCTION_NAME}
  Source:         remote

💸 Fee Info:
  Priority Fee:   {PRIORITY_FEE} μcredits
  Fee Record:     no (public fee) | {FEE RECORD}

⚙️ Actions:
  - Program and its dependencies will be downloaded from the network.
  - Transaction will NOT be printed to the console.
  - Transaction will NOT be saved to a file.
  - Transaction will NOT be broadcast to the network.

📊 Execution Summary for {PROGRAM_NAME}.aleo
──────────────────────────────────────────────
💰 Cost Breakdown (credits)
  Transaction Storage:  ...
  On‑chain Execution:   ...
  Priority Fee:         ...
  Total Fee:            ...
──────────────────────────────────────────────

➡️  Outputs

 • {OUTPUT_0}
 • {OUTPUT_1}
 ...
```


詳しくは **[Executing](./../guides/04_executing.md)** を参照してください。


### Flags:

#### `--private-key <PRIVATE_KEY>`
デプロイ／実行に使用する秘密鍵を指定します。`.env` や `$PRIVATE_KEY` の値より優先されます。

#### `--network <NETWORK>`
実行対象のネットワークを指定します。`.env` や `NETWORK` 環境変数の設定より優先されます。`testnet`、`mainnet`、`canary` が指定可能です。


#### `--endpoint <ENDPOINT>`
接続先のエンドポイントを指定します。`.env` や `ENDPOINT` 環境変数の設定より優先されます。

**よく使われるエンドポイント例:**
<!-- markdown-link-check-disable -->
| Network |  Endpoint  |
|:---------:|:------:|
| Devnet (local)  | https://localhost:3030 | 
| Testnet  | https://api.explorer.provable.com/v1| 
| Mainnet  | https://api.explorer.provable.com/v1| 
<!-- markdown-link-check-enable -->
#### `--devnet`
対象ネットワークが Devnet であることを示します。指定しない場合は `DEVNET` 環境変数の値が利用されます。

:::info
ローカルに Devnet が起動している必要があります。詳細は Devnet ガイドをご覧ください。
:::


#### `-print`
生成されたトランザクションを JSON 形式で端末に出力します。

#### `-broadcast`
処理成功後にトランザクションをネットワークへブロードキャストします。指定しない場合はローカル生成のみです。

#### `--save <SAVE>`
生成したトランザクションを `<SAVE>` で指定したディレクトリに保存します。

#### `-y`
#### `--yes`
処理中に表示される確認プロンプトへ自動的に同意します。

:::warning
用途を理解している場合のみ使用してください。
:::

#### `--priority-fees <PRIORITY_FEES>`
トランザクションに設定する優先手数料を `|` 区切りで指定します。単位はマイクロクレジットで、`u64` もしくは `default` を入力できます。既定値は 0 です。

:::tip
1 Credit = 1,000,000 Microcredits
:::


#### `-f <FEE_RECORDS>`
#### `--fee-records <FEE_RECORDS>`

手数料をプライベートに支払うためのレコードを `|` 区切りで指定します。平文、暗号文、`default` のいずれかを入力できます。未指定の場合、手数料は公開扱いになります。


#### `--consensus-heights <CONSENSUS_HEIGHTS>`
利用するコンセンサスの切り替えブロック高を `,` 区切りで指定します。カスタム Devnet を使用する場合のみ設定してください。

```bash
--consensus-heights 0,1,2,3....
```


#### `--consensus-version <CONSENSUS_VERSION>`
使用するコンセンサスバージョンを指定します。未指定の場合、最新ブロックの情報から自動判定を試みます。

#### `--max-wait <MAX_WAIT>`
トランザクション探索時に、新しいブロックを待機する秒数を指定します（既定値は 8 秒）。

#### `--blocks-to-check <BLOCKS_TO_CHECK>`
トランザクション探索時に確認するブロック数を指定します（既定値は 12 ブロック）。

```
Options:
--base-fees <BASE_FEES>
  [UNUSED] Base fees in microcredits, delimited by `|`, and used in order. The fees must either be valid `u64` or `default`. Defaults to automatic calculation.
--offline
    Enables offline mode.
--enable-ast-spans
    Enable spans in AST snapshots.
--enable-dce
    Enables dead code elimination in the compiler.
--conditional-block-max-depth <CONDITIONAL_BLOCK_MAX_DEPTH>
    Max depth to type check nested conditionals. [default: 10]
--disable-conditional-branch-type-checking
    Disable type checking of nested conditional branches in finalize scope.
--enable-initial-ast-snapshot
    Write an AST snapshot immediately after parsing.
--enable-all-ast-snapshots
    Writes all AST snapshots for the different compiler phases.
--ast-snapshots <AST_SNAPSHOTS>...
    Comma separated list of passes whose AST snapshots to capture.
--build-tests
    Build tests along with the main program and dependencies.
--no-cache
    Don't use the dependency cache.
--no-local
    Don't use the local source code.
```
