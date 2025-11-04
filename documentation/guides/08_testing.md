---
id: test 
title: Testing, Testing, 123
sidebar_label: テスト
---
[general tags]: # (guides, tests, testing, unit_testing, integration_testing, devnet, testnet)

一度デプロイされたアプリケーションはレジャーに永続的に残るため、あらゆるケースを想定して厳密にテストすることが重要です。Leo では以下のようなツールや手法を活用できます。

- [**ユニット／結合テスト**](#test-framework) — テストケースを通じて Leo プログラムのロジックを検証します。

- [**Devnet の実行**](#running-a-devnet) — ローカル Devnet でデプロイや実行を行います。

- [**Testnet でデプロイ／実行**](#deployingexecuting-on-testnet) — Aleo Testnet 上でデプロイと実行を行います。

- [**その他のツール**](#other-tools) — オープンソースコミュニティが開発したツールや手法を紹介します。


## ユニットと結合テスト {#test-framework}
Leo のテストフレームワークでは、ユニットテストや結合テストを記述してプログラムロジックを検証できます。テストは Leo で記述し、プロジェクトルートの `tests/` サブディレクトリに配置します。

```bash
example_program
├── build
│   ├── imports
│   │   └── test_example_program.aleo
│   ├── main.aleo
│   └── program.json
├── outputs
├── src
│   └── main.leo
├── tests
│   └── test_example_program.leo
└── program.json
```
テストファイルは `main.leo` のプログラムをインポートする Leo プログラムです。各テスト関数の宣言には `@test` アノテーションを付けます。

ここでは [サンプルリポジトリ](https://github.com/ProvableHQ/leo-examples/tree/main/example_with_test) にあるプログラムを例に説明します。

:::info
`tests/` ディレクトリには複数の Leo ファイルを追加できますが、テストファイル名とそのファイル内で宣言するプログラム名は一致している必要があります。例えば `test_example_program.leo` というファイル名であれば、プログラム名も `test_example_program.aleo` でなければなりません。
:::


### `transition` 関数をテストする

`example_program.leo` には 2 つの `u32` 入力の和を返すトランジションが定義されています。

```leo
transition simple_addition(public a: u32, b: u32) -> u32 {
    let c: u32 = a + b;
    return c;
}
```

`test_example_program.leo` では、トランジションが正しい出力を返すことと、誤った結果のときに失敗することを確認するテストを 2 本用意しています。
```leo
@test
transition test_simple_addition() {
    let result: u32 = example_program.aleo/simple_addition(2u32, 3u32);
    assert_eq(result, 5u32);
}
```

失敗を期待するテストには、`@test` の直後に `@should_fail` アノテーションを追加します。
```leo
@test
@should_fail
transition test_simple_addition_fail() {
    let result: u32 = example_program.aleo/simple_addition(2u32, 3u32);
    assert_eq(result, 3u32);
}
```

### Leo の型をテストする

レコードや構造体のフィールドが想定通りかどうかもテストできます。`example_program.leo` では次のようにレコードをミントするトランジションが定義されています。

```leo
record Example {
    owner: address,
    x: field,
}

transition mint_record(x: field) -> Example {
    return Example {
        owner: self.signer,
        x,
    };
}
```

対応するテストでは、生成されたレコードのフィールドに正しい値が入っているか確認します。

```leo
@test
transition test_record_maker() {
    let r: example_program.aleo/Example = example_program.aleo/mint_record(0field);
    assert_eq(r.x, 0field);
}
```

:::info
各テストファイルには少なくとも 1 つの `transition` 関数が必要です。
:::


### オンチェーン状態のモデル化
テストフレームワークは `testnet` や `mainnet` のオンチェーン状態にはアクセスできませんが、`script` を使ってオンチェーンの振る舞いを模倣できます。スクリプトは解釈実行される Leo コードで、`Future` の待機やマッピングの更新を行えます。解釈実行テストを使う場合、`transition` や `function` の代わりに `script` キーワードを使用します。

```leo
@test
script test_async() {
    const VAL: field = 12field;
    let fut: Future = example_program.aleo/set_mapping(VAL);
    fut.await();
    assert_eq(Mapping::get(example_program.aleo/map, 0field), VAL);

    let rand_val: field = ChaCha::rand_field();
    Mapping::set(example_program.aleo/map, VAL, rand_val);
    let value: field = Mapping::get(example_program.aleo/map, VAL);
    assert_eq(value, rand_val);
}
```

:::info
外部トランジション（`async` を含む）はテスト用の `transition` やスクリプトから呼び出せますが、外部の `async function` を直接呼び出せるのはスクリプトのみです。
:::


### テストの実行
`leo test` を実行すると、コンパイル済みテストと解釈実行テストの両方が実行されます。特定のテストだけを走らせたい場合は、関数名または関数名に含まれる文字列を指定します。例えば `test_async` を実行するには次のコマンドを使います。
```bash
leo test test_async
```
次のどちらかのコマンドでも、加算関数に関するテスト 2 本を実行できます。
```bash
leo test simple
```
または
```bash
leo test addition
```

`leo test` コマンドの詳細は [こちら](./../cli/13_test.md) を参照してください。


## Devnet を動かす {#running-a-devnet}

ローカル Devnet は手間こそかかりますが、Aleo 上でアプリケーションをテストする確実な方法です。詳しくは [Devnet ガイド](./07_devnet.md) を参照してください。

## Testnet でのデプロイと実行 {#deployingexecuting-on-testnet}
Testnet でデプロイ・実行するには、エンドポイントを公開されている API に戻す必要があります。また、以下のファウセットから Testnet クレジットを取得する必要があります。

### ファウセット

<!--TODO: Update this information once the new faucet becomes public.-->

テストネットクレジットが必要になったら、コミュニティが提供する以下のファウセットを利用できます。
- [**Puzzle**](https://dev.puzzle.online/faucet) — 15 credits / 4 hours

- [**Demox**](https://discord.com/channels/913160862670397510/1202322326230937640/1203135682873266207) — 10 credits / 12 hours

ファウセットの残高は定期的に補充されます。


## その他のツール {#other-tools}

Aleo コミュニティではテストを支援する便利なツールも開発されています。

- [**doko.js**](https://github.com/venture23-aleo/doko-js)
