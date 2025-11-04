---
id: deploy
title: プログラムをデプロイする
sidebar_label: デプロイ
---
[general tags]: # (guides, deploy, deployment, program)

`leo deploy` コマンドは、Leo プログラムをローカル Devnet・Testnet・Mainnet にデプロイする際に使用します。  
ネットワーク上の既存プログラムをアップグレードするには `leo upgrade` コマンドを使用します。

## はじめに
Leo プログラムのルートディレクトリで次を実行します。
```bash
leo deploy --help
```
`leo deploy` で利用できるオプションがすべて表示されます。
```bash
Deploy a program

Usage: leo deploy [OPTIONS]

Options:
      --base-fees <BASE_FEES>
          [UNUSED] Base fees in microcredits, delimited by `|`, and used in order. The fees must either be valid `u64` or `default`. Defaults to automatic calculation.
  -d
          Print additional information for debugging
      --priority-fees <PRIORITY_FEES>
          Priority fee in microcredits, delimited by `|`, and used in order. The fees must either be valid `u64` or `default`. Defaults to 0.
  -q
          Suppress CLI output
  -f, --fee-records <FEE_RECORDS>
          Records to pay for fees privately, delimited by '|', and used in order. The fees must either be valid plaintext, ciphertext, or `default`. Defaults to public fees.
      --print
          Print the transaction to stdout.
      --broadcast
          Broadcast the transaction to the network.
      --save <SAVE>
          Save the transaction to the provided directory.
      --private-key <PRIVATE_KEY>
          The private key to use for the deployment. Overrides the `PRIVATE_KEY` environment variable.
      --network <NETWORK>
          The network to deploy to. Overrides the `NETWORK` environment variable.
      --endpoint <ENDPOINT>
          The endpoint to deploy to. Overrides the `ENDPOINT` environment variable.
      --devnet
          Whether the network is a devnet. If not set, defaults to the `DEVNET` environment variable.
      --consensus-heights <CONSENSUS_HEIGHTS>
          Optional consensus heights to use. This should only be set if you are using a custom devnet.
  -y, --yes
          Don't ask for confirmation. DO NOT SET THIS FLAG UNLESS YOU KNOW WHAT YOU ARE DOING
      --consensus-version <CONSENSUS_VERSION>
          Consensus version to use. If one is not provided, the CLI will attempt to determine it from the latest block.
      --max-wait <MAX_WAIT>
          Seconds to wait for a block to appear when searching for a transaction. [default: 8]
      --blocks-to-check <BLOCKS_TO_CHECK>
          Number of blocks to look at when searching for a transaction. [default: 12]
      --skip <SKIP>...
          Skips deployment of any program that contains one of the given substrings.
      --offline
          Enables offline mode.
      --enable-ast-spans
          Enable spans in AST snapshots.
      --path <PATH>
          Path to Leo program root folder
      --enable-dce
          Enables dead code elimination in the compiler.
      --home <HOME>
          Path to aleo program registry
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
  -h, --help
          Print help
```


## クイックスタート
`leo new` を実行すると、`.env` を含む標準的なファイル／ディレクトリが生成されます。`.env` の既定値は、ローカルノードの API エンドポイントを使って Testnet 用 Devnet にデプロイする設定になっています。

デプロイ手順を試すには、別のターミナルで `leo devnet` を実行して Devnet を起動し（事前に必要な設定を済ませておいてください）、次のコマンドを実行します。
```bash
> leo deploy  --devnet --broadcast
       Leo
2 statements before dead code elimination.
       Leo     2 statements after dead code elimination.
       Leo     The program checksum is: '[96u8, 221u8, 32u8, 227u8, 44u8, 46u8, 93u8, 242u8, 17u8, 214u8, 17u8, 134u8, 170u8, 250u8, 59u8, 72u8, 48u8, 182u8, 210u8, 153u8, 135u8, 38u8, 214u8, 209u8, 12u8, 135u8, 252u8, 74u8, 132u8, 140u8, 123u8, 209u8]'.
       Leo ✅ Compiled 'helloworld.aleo' into Aleo instructions.

📢 Using the following consensus heights: 0,10,11,12,13,14,15,16,17
  To override, pass in `--consensus-heights` or override the environment variable `CONSENSUS_VERSION_HEIGHTS`.

Attempting to determine the consensus version from the latest block height at http://localhost:3030...

🛠️  Deployment Plan Summary
──────────────────────────────────────────────
🔧 Configuration:
  Private Key:        APrivateKey1zkp8CZNn3yeC...
  Address:            aleo1rhgdu77hgyqd3xjj8uc...
  Endpoint:           http://localhost:3030
  Network:            testnet
  Consensus Version:  9

📦 Deployment Tasks:
  • helloworld.aleo  │ priority fee: 0  │ fee record: no (public fee)

⚙️ Actions:
  • Transaction(s) will NOT be printed to the console.
  • Transaction(s) will NOT be saved to a file.
  • Transaction(s) will be broadcast to http://localhost:3030
──────────────────────────────────────────────

? Do you want to proceed with deployment? (y/n) › no
> leo deploy  --devnet --broadcast
       Leo
2 statements before dead code elimination.
       Leo     2 statements after dead code elimination.
       Leo     The program checksum is: '[96u8, 221u8, 32u8, 227u8, 44u8, 46u8, 93u8, 242u8, 17u8, 214u8, 17u8, 134u8, 170u8, 250u8, 59u8, 72u8, 48u8, 182u8, 210u8, 153u8, 135u8, 38u8, 214u8, 209u8, 12u8, 135u8, 252u8, 74u8, 132u8, 140u8, 123u8, 209u8]'.
       Leo ✅ Compiled 'helloworld.aleo' into Aleo instructions.

📢 Using the following consensus heights: 0,10,11,12,13,14,15,16,17
  To override, pass in `--consensus-heights` or override the environment variable `CONSENSUS_VERSION_HEIGHTS`.

Attempting to determine the consensus version from the latest block height at http://localhost:3030...

🛠️  Deployment Plan Summary
──────────────────────────────────────────────
🔧 Configuration:
  Private Key:        APrivateKey1zkp8CZNn3yeC...
  Address:            aleo1rhgdu77hgyqd3xjj8uc...
  Endpoint:           http://localhost:3030
  Network:            testnet
  Consensus Version:  9

📦 Deployment Tasks:
  • helloworld.aleo  │ priority fee: 0  │ fee record: no (public fee)

⚙️ Actions:
  • Transaction(s) will NOT be printed to the console.
  • Transaction(s) will NOT be saved to a file.
  • Transaction(s) will be broadcast to http://localhost:3030
──────────────────────────────────────────────

✔ Do you want to proceed with deployment? · yes


🔧 Your program 'helloworld.aleo' has the following constructor.
──────────────────────────────────────────────
constructor:
    assert.eq edition 0u16;
──────────────────────────────────────────────
Once it is deployed, it CANNOT be changed.

✔ Would you like to proceed? · yes

📦 Creating deployment transaction for 'helloworld.aleo'...


📊 Deployment Summary for helloworld.aleo
──────────────────────────────────────────────
  Total Variables:      16,995
  Total Constraints:    12,927
  Max Variables:        2,097,152
  Max Constraints:      2,097,152

💰 Cost Breakdown (credits)
  Transaction Storage:  0.879000
  Program Synthesis:    0.748050
  Namespace:            1.000000
  Constructor:          0.050000
  Priority Fee:         0.000000
  Total Fee:            2.677050
──────────────────────────────────────────────

📡 Broadcasting deployment for helloworld.aleo...
💰Your current public balance is 93749999.894112 credits.

✔ This transaction will cost you 2.67705 credits. Do you want to proceed? · yes

✉️ Broadcasted transaction with:
  - transaction ID: 'at1wnrupt8fvsck0jll4mu94e23uhmgwhjpftaazcephm8nu0yyvqrsm27apa'
  - fee ID: 'au1rqczm86uw6jwcx8ychgvy677axrsh2vjjz8kh0cmpaw87xyp7q9q20fpa7'
  - fee transaction ID: 'at12rgh8c58sc0npxusg065p6xrsrk60pmfg02t5047rf5dp096g5ysdftz4f'
    (use this to check for rejected transactions)

🔄 Searching up to 12 blocks to confirm transaction (this may take several seconds)...
```

```text
Explored 2 blocks.
Transaction accepted.
✅ Deployment confirmed!
```

`leo deploy` を実行すると、以下の処理が行われます。
- プログラムをコンパイルし、必要な AVM 命令を生成します。
- プログラムのチェックサム（一意の識別子）を表示します。
- 変数や制約数などを含むデプロイ概要を表示します。
- デプロイを進める前に確認を求めます。
- 指定したネットワークにトランザクションをブロードキャストします。
- トランザクションが確定するまで待機し、トランザクション ID を表示します。

## プログラムをアップグレードする

すでにデプロイ済みのプログラムを更新したい場合は、`leo upgrade` コマンドを使用します。  
アップグレードが成功するのは、コンストラクタでアップグレードを許可している（アップグレード可能な）プログラムだけです。  
アップグレード可能にする方法については [Upgradability ガイド](../guides/10_program_upgradability.md) を参照してください。


## オプションと環境変数
デプロイやアップグレードでは、ターゲットネットワーク・秘密鍵・ノード API エンドポイントを指定する必要があります。指定方法は優先順位の高い順に次のとおりです。
1. CLI のオプション
2. 環境変数
3. `.env` ファイル

より優先度の高い指定がある場合、下位の設定は上書きされます。  
たとえば `--network` オプションが指定されていれば、`.env` の値より優先されます。

`.env` ファイルは次の形式で記述します。
```bash
NETWORK=testnet
PRIVATE_KEY=APrivateKey1z...GPWH
ENDPOINT=https://api.explorer.provable.com/v1
```

ローカル Devnet にデプロイする場合は `--devnet` フラグを利用してください。
