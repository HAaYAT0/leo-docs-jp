---
id: execute
title: プログラムを実行する
sidebar_label: 実行
---

[general tags]: # (guides,execute, execution, transaction, transition, transaction_status, async_transition)

`leo execute` コマンドは Leo プログラムを実行し、トランザクションオブジェクトを出力します。
```bash
leo execute <FUNCTION_NAME> <INPUT_1> <INPUT_2> ...
```

リモートにデプロイされた Leo プログラムの関数を実行することもできます。
```bash
leo execute <PROGRAM_NAME>.aleo/<FUNCTION_NAME> <INPUT_1> <INPUT_2> ...
```

ローカルプロジェクトの関数を実行する場合、`leo execute` はまずプログラムをビルド／コンパイルします。

```bash title="console output:"
       Leo     2 statements before dead code elimination.
       Leo     2 statements after dead code elimination.
       Leo     The program checksum is: '[212u8, 91u8, ... , 107u8]'.
       Leo ✅ Compiled 'hello.aleo' into Aleo instructions.

```
その後、実行計画の概要が表示されます。
```bash
🚀 Execution Plan Summary
──────────────────────────────────────────────
🔧 Configuration:
  Private Key:        APrivateKey1zkp...
  Address:            aleo1...
  Endpoint:           https://api.explorer.provable.com/v1
  Network:            <testnet | mainnet>
  Consensus Version:  9

🎯 Execution Target:
  Program:        <PROGRAM_NAME>
  Function:       <FUNCTION_NAME>
  Source:         <local | remote>

💸 Fee Info:
  Priority Fee:   0 μcredits
  Fee Record:     no (public fee)

⚙️ Actions:
  - Transaction will NOT be printed to the console.
  - Transaction will NOT be saved to a file.
  - Transaction will NOT be broadcast to the network.
```

最後に、実行コストの内訳と関数の出力が表示されます。
```bash
📊 Execution Summary for <PROGRAM_NAME>
──────────────────────────────────────────────
💰 Cost Breakdown (credits)
  Transaction Storage:  0.001316
  On‑chain Execution:   0.000000
  Priority Fee:         0.000000
  Total Fee:            0.001316
──────────────────────────────────────────────

➡️  Output

  • <OUTPUT_1>
  • <OUTPUT_2>
  ...
```

内部的には、`leo execute` は JSON オブジェクトを生成します。これは Aleo ネットワークへブロードキャスト可能な [`Transaction`](https://developer.aleo.org/concepts/fundamentals/transactions) です。`--print` フラグを付けると、この JSON の内容を確認できます。
