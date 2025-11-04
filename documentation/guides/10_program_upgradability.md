---
id: upgradability 
title: プログラムをアップグレードする
sidebar_label: プログラムのアップグレード
---
[general tags]: # (guides, upgrade, program, transaction, constructor)

# Leo におけるアップグレード開発ガイド

このガイドでは、Aleo のプログラムアップグレード機構を Leo 開発者向けに実践的に解説します。プログラムの設定方法や代表的なパターン、セキュアで保守しやすいアプリケーションを構築するためのベストプラクティスを紹介します。プロトコルの詳細は [Aleo Docs](https://developer.aleo.org/guides/program_upgradability/) を参照してください。

## アップグレードポリシーの基本

Leo プログラムでは、`constructor` に付与するアノテーションでアップグレード方針を定義します。Leo コンパイラはこのアノテーションを読み取り、意図に沿った基盤コードを生成します。

主なモードは次の 4 種類です。

| モード         | 説明                                                                                                   |
|:---------------|:-------------------------------------------------------------------------------------------------------|
| `@noupgrade`   | アップグレードを禁止します。                                                                           |
| `@admin`       | ハードコードした 1 つの管理者アドレスによってアップグレードを制御します。                             |
| `@checksum`    | 別プログラム（DAO など）が管理するオンチェーンチェックサムを参照してアップグレードを制御します。     |
| `@custom`      | `constructor` 内のロジックをすべて手書きし、独自ポリシーを実装します。                                 |

## コアの仕組み

アップグレードは特別な `constructor` 関数とオンチェーンのプログラムメタデータを中心に機能します。

### `constructor` について

`constructor` は各デプロイとアップグレード時にオンチェーンで実行される特別な関数で、プログラムの門番に相当します。重要な性質は次の 2 つです。

- **必須であること**: すべてのプログラムは `constructor` を定義してデプロイする必要があります。`constructor` 内のロジック（`assert` など）が失敗すると、デプロイ／アップグレードのトランザクション全体が拒否されます。
- **不変であること**: 最初のデプロイ時に設定した `constructor` のロジックは将来のアップグレードでも変更できません。ここでバグを仕込むと永久に修正できないため、慎重に監査しましょう。

### プログラムメタデータオペランド

`constructor` 内では `self` キーワードを使ってプログラムに紐づくオンチェーンメタデータへアクセスできます。

| オペランド           | Leo 型     | 説明                                                                                                     |
| :------------------- |:-----------|:---------------------------------------------------------------------------------------------------------|
| `self.edition`       | `u16`      | プログラムのバージョン番号。初期値は `0` で、アップグレードごとに自動的に `1` ずつ増加します。          |
| `self.program_owner` | `address`  | デプロイ（またはアップグレード）トランザクションを送信したアドレス。                                      |
| `self.checksum`      | `[u8, 32]` | プログラムコードのチェックサム。ユニークな識別子として扱われます。                                       |

他プログラムのメタデータにアクセスする場合は `Program::edition(credits.aleo)` のようにプログラム名を指定します（事前にインポートが必要です）。

注意: アップグレード機能導入前（Leo v3.1.0 より前）にデプロイされたプログラムには `program_owner` が存在しないため、アクセスするとランタイムエラーになります。

---

## Leo で使えるアップグレードパターン

ここでは代表的なパターンを紹介します。動作するサンプルは [公式サンプル集](https://github.com/ProvableHQ/leo-examples/tree/main/upgrades) にも用意されています。

### パターン 1: 非アップグレード

**目的:** すべての将来のアップグレードを明示的に禁止します。

**`main.leo`**

コンパイラが初期バージョンを固定するコンストラクタを自動生成します。

```leo
// The 'noupgrade_example' program.
program noupgrade_example.aleo {
    // This constructor is for the "noupgrade" mode.
    // It is immutable and prevents any future upgrades.
    @noupgrade
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }
    
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
```

生成される AVM コード:
```
constructor:
    assert.eq edition 0u16
```

### パターン 2: 管理者によるアップグレード

**目的:** ハードコードした 1 つの管理者アドレスだけがアップグレードを実行できるようにします。

**`main.leo`**

```leo
// The 'admin_example' program.
program admin_example.aleo {
    // This constructor is for the "admin" mode.
    // It ensures that only the designated admin can upgrade the program.
    @admin(address="aleo1rhgdu77hgyqd3xjj8ucu3jj9r2p3lam3tc3h0nvv2d3k0rp2ca5sqsceh7")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }
    
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
```

生成される AVM コード:
```
constructor:
    assert.eq program_owner aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px;
```

### パターン 3: チェックサムによるアップグレード（投票例）

**目的:** 承認済みチェックサムを管理する別プログラム（ガバナンスコントラクト）にアップグレード権限を委任します。

**`main.leo`**

`mapping` と `key` を指定すると、`basic_voting.aleo` のマッピングを参照するコンストラクタが生成されます。

```leo
// The 'vote_example' program.
program vote_example.aleo {
    // This constructor is for the "checksum" mode.
    @checksum(mapping="basic_voting.aleo/approved_checksum", key="true")
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }
    
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
```

生成される AVM コード:
```
constructor:
    branch.eq edition 0u16 to end;
    get basic_voting.aleo/approved_checksum[true] into r0;
    assert.eq checksum r0;
    position end;
```

### パターン 4: カスタムロジック（タイムロック例）

**目的:** アップグレードを許可する前に一定のブロック高を要求するなど、独自のタイムロジックを導入します。

**`main.leo`**

`@custom` を使う場合、コンストラクタのロジックはすべて自分で実装します。

```leo
// The 'timelock_example' program.
program timelock_example.aleo {
    @custom
    async constructor() {
        // For upgrades (edition > 0), enforce a block height condition on when the constructor can be called successfully
        if self.edition > 0u16 {
            assert(block.height >= 1300u32);
        }
    }
    
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
```

生成される AVM コード:
```
constructor:
    gt edition 0u16 into r0;
    branch.eq r0 false to end_then_0_0;
    gte block.height 1300u32 into r1;
    assert.eq r1 true;
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;
```

-----

## ルール: 変更できるもの・できないもの

プロトコルは、依存アプリケーションとの互換性やオンチェーン状態の整合性が崩れないよう、厳格なルールを設けています。

アップグレードで **可能な** こと:

- 既存の `transition` や `async function` の内部ロジックを変更する。
- 新しい `struct`、`record`、`mapping`、`transition`、`function` を追加する。

アップグレードで **禁止されている** こと:

- 既存の `transition`／`function`／`async transition`／`async function` の入出力シグネチャを変更する。
- 非インライン `function` のロジックを変更する。
- 既存の `struct`／`record`／`mapping` を変更または削除する。
- 既存のプログラム要素を削除する。

| プログラム要素     | 削除 | 変更 | 追加 |
|:------------------|:---:|:---:|:---:|
| `import`          | ❌ | ❌ | ✅ |
| `struct`          | ❌ | ❌ | ✅ |
| `record`          | ❌ | ❌ | ✅ |
| `mapping`         | ❌ | ❌ | ✅ |
| `function`        | ❌ | ❌ | ✅ |
| `transition`      | ❌ | ✅（ロジックのみ） | ✅ |
| `async function`  | ❌ | ✅（ロジックのみ） | ✅ |
| `constructor`     | ❌ | ❌ | ❌ |

-----

## セキュリティチェックリスト

プログラムをアップグレード可能にすると、新たなリスクも生まれます。以下の点に留意しましょう。

- **`constructor` を徹底的に監査する。** ロジックは永続であり、デプロイ後に修正できません。
- **単独管理者よりマルチシグや DAO を優先する。** 単一障害点を避けることで安全性が高まります。
- **大型アップグレードにはタイムロックを導入する。** ユーザーが変更に備えられる期間を設けると信頼につながります。
- **将来的な固定化（ossification）も計画する。** 管理権を焼却アドレスに譲渡するなど、最終的に不変化できる仕組みを用意しましょう。

## 旧バージョンのプログラム

アップグレード機能導入前（`constructor` を持たない）にデプロイされたプログラムは、**永久にアップグレードできません**。後からアップグレード可能にする方法は存在しません。新機能を追加したい場合は新しいプログラムをデプロイし、ユーザーに移行してもらう必要があります。
