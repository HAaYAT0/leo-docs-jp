---
id: hello
title: Hello, Leo
sidebar_label: Hello, Leo
---
[general tags]: # (hello_leo, starter_project)

## プロジェクトの初期化

Leo コマンドラインインターフェース (CLI) を使って新しいプロジェクトを作成します。ターミナルで次を実行してください。
```bash
leo new hello
cd hello
```

すると、以下のようなディレクトリ構成が作成されます。

```bash
hello/
├── .gitignore # Leo プロジェクト向けの標準 `.gitignore`
├── .env # `NETWORK` と `PRIVATE_KEY` を含む環境変数ファイル
├── program.json # Leo プロジェクトのマニフェスト
├── tests/
  └── test_hello.leo # ユニットテスト用の Leo ソースコード
└── src/
  └── main.leo # メインとなる Leo ソースコード
```


## プロジェクトを読み解く

### マニフェスト

**program.json** はパッケージ設定を記述する Leo のマニフェストファイルです。
```json title="program.json"
{
  "program": "hello.aleo",
  "version": "0.1.0",
  "description": "",
  "license": "MIT",
  "dependencies": null,
  "dev_dependencies": null
}
```

`program` の値は、プログラムをネットワークへデプロイした後に他の開発者が参照する正式名称です。`main.leo` 内で宣言するプログラム名と一致していないと、コンパイルは失敗します。

依存関係を追加すると `dependencies` フィールドに、開発時のみ使用する依存関係は `dev_dependencies` フィールドに追記されます。

### コード
`src/main.leo` が Leo プロジェクトのエントリーポイントです。初期状態では `main` という名前の関数が含まれています。Leo ファイルの構造を見てみましょう。
```leo title="src/main.leo" showLineNumbers
// The 'hello' program.
program hello.aleo {
    @noupgrade
    async constructor() {}

    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
```

`program` キーワードは Leo ファイル内での[プログラム](./../language/02_structure.md#program-scope)名を示します。この例では `hello.aleo` です。前述のとおり、マニフェスト `program.json` の値と一致している必要があります。

`transition` キーワードは Leo における[トランジション](./../language/02_structure.md#transition-function)関数の定義を示します。`main` トランジションは `u32` 型で `public` 可視性の引数 `a` と、同じく `u32` 型で（既定では）`private` 可視性の引数 `b` を受け取ります。戻り値は `u32` が 1 つです。関数本体は波括弧 `{ }` で囲まれています。
```leo
transition main(public a: u32, b: u32) -> u32 {
```

`main` 関数内では、`u32` 型の変数 `c` を宣言し、`a` と `b` の足し算結果を代入しています。Leo のコンパイラは `a` と `b` の型が一致していること、加算結果が `u32` 型であることをチェックします。
```leo
let c: u32 = a + b;
```

:::note
Leo は静的で強力な型チェックにより、多くのエラーをコンパイル時に検出できるよう設計されています。変数の型を変更して、どのようなエラーメッセージが表示されるか試してみましょう。
:::

最後に変数 `c` を返します。Leo は `c` の型が関数の戻り値である `u32` と一致しているか確認します。
```leo
return c;
```

また、`constructor` と呼ばれる特別な関数があります。これはプログラムのアップグレード機能を有効にするためのもので、デプロイ後に一部のロジックや内容を更新できるようにします。

```leo
@noupgrade
async constructor() {}
```

コンストラクタはプログラムの門番として機能し、デプロイやアップグレードのたびに実行され、誰がどのようにこのプログラムをデプロイ・更新できるかを制御します。


:::note
すべてのプログラムはコンストラクタ関数を明示的に定義する必要があります。
:::

ここでは何も処理を入れず、そのままにしておきます（アップグレードを防ぐ設定です）。アップグレードの仕組みやパターンについて詳しく知りたい場合は、[Upgrading Programs](./../guides/10_program_upgradability.md) を参照してください。


それではプログラムをコンパイルして実行してみましょう。

## ビルドと実行

プログラムをコンパイルするには次を実行します。
```
leo build
```
 
`leo build` を実行すると、プロジェクト内に `build/` と `output/` フォルダが自動生成されます。コンパイル済みコードは `build` ディレクトリに、中間成果物は `output` ディレクトリに保存されます。


`leo run` コマンドは、指定した関数をコンパイルして実行します。ターミナルで次を実行してください。
```bash
leo run main 1u32 2u32
```

```bash title="console output:"
       Leo     2 statements before dead code elimination.
       Leo     2 statements after dead code elimination.
       Leo     The program checksum is: '[212u8, 91u8, ... , 107u8]'.
       Leo ✅ Compiled 'hello.aleo' into Aleo instructions.

⛓  Constraints

 •  'hello.aleo/main' - 33 constraints (called 1 time)

➡️  Output

 • 3u32

       Leo ✅ Finished 'hello.aleo/main' (in "./hello/build")
```

## デプロイと実行
ローカルでプログラムを動かせるだけでなく、実際にデプロイしてオンチェーンで関数を実行したくなるでしょう。その場合は `leo deploy` でデプロイし、`leo execute` で関数を実行してトランザクション（必要なメタデータとゼロ知識証明を含む）を生成します。

詳しくは [Deploying](./../guides/03_deploying.md) と [Executing](./../guides/04_executing.md) のガイドをご覧ください。


## クリーンアップ
作成されたビルドファイルや出力を削除するには、次を実行します。
```bash
leo clean
```

```bash title="console output:"
Leo 🧹 Cleaned the outputs directory ./hello/outputs
Leo 🧹 Cleaned the build directory ./hello/build
```


## 次のステップ

Leo 言語と構文について詳しく学ぶには、[こちら](./../language/00_overview.md) から始めてください。

Leo CLI の使い方をさらに知りたい場合は、[こちら](./../cli/00_overview.md) を参照してください。

サンプルプロジェクトを試したい場合は **Leo By Example** セクションをチェックしましょう。
