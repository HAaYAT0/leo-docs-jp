---
id: style
title: スタイルガイド
sidebar: スタイルガイド
---
[general tags]: # ()

このガイドは Leo コードを書く際に開発者が迷わないよう指針を示すものです。Leo 言語と、そのコンパイルによって生成される回路には固有の慣習が多数存在します。

本ドキュメントは随時更新されるライブ資料です。新しいコーディング規約が生まれたり、古いものが廃れていくにつれて内容も更新されるべきです。コメントや提案があれば、遠慮なく [こちら](#contributing) へ追記してください。


## コードレイアウト

### インデント
インデントは 4 スペースを使用します。

### 空行

`program` スコープ内のトップレベル宣言（`transition`、`function`、`struct`、`record`、`mapping`）は 1 行の空行で区切ります。インポート文は必要に応じて 1 行で区切っても構いませんが、ファイル冒頭の最後のインポート文の直後には必ず空行を入れてください。

```leo title="良い例:"
import std.io.Write;
import std.math.Add;

program prog.aleo {

    struct A {
        // ...
    }

    function foo() {
        // ...
    }

}
```

```leo title="悪い例:"
import std.io.Write;


import std.math.Add;
program prog.aleo {
    struct A {
        // ...
    }
    function foo() {
        // ...
    }
}
```

### 命名規則

| 項目                      | 規約                                  |
|---------------------------|---------------------------------------|
| パッケージ                | スネークケース（原則 1 語）           |
| 構造体・レコード          | キャメルケース                        |
| 構造体・レコードのメンバー| スネークケース                        |
| 関数                      | スネークケース                        |
| 関数パラメータ            | スネークケース                        |
| 変数                      | スネークケース                        |
| 入力                      | スネークケース                        |

### 並び順
Leo ファイルの要素は次の順序で配置することを推奨します。
1. インポート
2. プログラム宣言
3. マッピング
4. レコードと構造体
5. 関数とトランジション


### 波括弧
開き波括弧は常に同じ行へ記述します。
```leo
struct A {
    // ...
}

transition main() {
    // ...
}

let a: A = A { };
```

### セミコロン
`return` を含むすべての文の末尾にセミコロンを付けます。
```leo
let a: u32 = 1u32;
let b: u32 = a + 5u32;
b *= 2u32;

return b;
```

### カンマ
閉じ括弧が別行に置かれる場合は末尾カンマを追加します。
```leo
let a: A = A { x: 0, y: 1 };

let a: A = A {
    x: 0,
    y: 1,
};
```

## よく使うパターン

上記のスタイルガイドを踏まえ、Leo 開発で遭遇しやすいパターンと推奨コードを紹介します。

### 条件分岐

Leo コンパイラはトランジション内の if-else 文を三項演算子の組み合わせへ書き換えます。基盤となる回路生成が分岐をサポートしていないためです。回路サイズを精密に制御したい場合は、最初から三項演算子を利用するのがおすすめです。

```leo title="例:"
if (condition) {
    return a;
} else {
    return b;
} 
```

```leo title="代替案:"
return condition ? a : b;
```

#### 理由
三項演算子は最も低コストな条件分岐です。条件を評価する前に「真の場合」と「偽の場合」の値をそれぞれ計算できるため、どちらの結果も独立に導けます。これにより回路へ変換する際もシンプルになります。

一方、上記の if-else では条件を評価しない限りどちらの return が実行されるか分かりません。そのため Leo は回路上で両方の経路を評価し、最後にどちらを選択するかを決める必要があります。結果として条件内部の計算コストが倍増し、制約数も大幅に増えることになります。

## コントリビューション {#contributing}

Leo をより良くしてくださりありがとうございます！

貢献する前に [Contributor Code of Conduct](https://github.com/ProvableHQ/leo/blob/mainnet/CONTRIBUTING.md) をご確認ください。Issue や PR、コミュニティでの対話を含め、プロジェクトに参加することで規約に同意したものとみなされます。

## Issue の報告

Issue を報告する際は、[GitHub Issues](https://github.com/ProvableHQ/leo/issues) をご利用ください。以下の情報を記載していただけると助かります。

- 利用している Leo のバージョン
- 対象となるソースコード（可能であれば）
- 使用しているプラットフォーム
- 再現手順
- 実際の結果と期待した結果

問題を再現するためのコードを最小化すると、原因の切り分けが容易になります。

## Pull Request の作成

変更を行う際は `mainnet` ブランチをフォークして作業してください。コミットメッセージは目的と内容が分かるように書きましょう。

フォーク後に `mainnet` の変更を取り込みたい場合は、`git merge` ではなく `git rebase` を使用してください。リベースの方がレビューがスムーズになります。

### 必要なツール

Leo をソースからビルドするには次のツールが必要です。
- Rust の最新 stable 版と nightly 版  
  - `rustup` を利用して複数バージョンをインストールすることを推奨します。
- Cargo  
  - `cargo install rusty-hook` で Rusty Hook を導入します。
- Clippy  
  - 既定の `rustup` インストールを行わなかった場合は `rustup component add clippy` で追加します。

### フォーマット

PR を送る前に以下を実行してください。
- `cargo +nightly fmt --all` でコード全体を整形する
- `cargo clippy --all-features --examples --all --benches` を実行する

### テスト

新機能を追加した場合は、期待通りに動作することを確認するテストを書いてください。既存のテストを参考に形式を揃えましょう。詳しくは [parser tests](#parser-tests) を参照してください。テストの実行は `cargo test --all --features ci_skip --no-fail-fast` で行います。

#### **パーサーテスト** {#parser-tests}

リポジトリのルートには `tests` ディレクトリがあります。パーサーテストを追加する場合は、`parser` サブディレクトリ内のサンプル Leo ファイルを参考にしてください。テストを実行する際は環境変数 `CLEAR_LEO_TEST_EXPECTATIONS` を `true` に設定する必要があります。UNIX 系 OS では次のように実行できます。

```bash
CLEAR_LEO_TEST_EXPECTATIONS=true cargo test --all --features ci_skip --no-fail-fast
```

### 文法

[grammars リポジトリ](https://github.com/ProvableHQ/grammars) には Leo の文法ルールを記述した [`leo.abnf`](https://github.com/ProvableHQ/grammars/blob/master/leo.abnf) が含まれています。文法に影響する変更を行った場合は、このファイルの更新をお願いすることがあります。

皆さまの貢献に感謝します！
