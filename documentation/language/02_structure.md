---
id: structure 
title: Leo プログラムの構造 
sidebar_label: プログラム構造
---
[general tags]: # (program, constant, import, transition, async_transition, function, async_function, inline, record, struct, mapping)

## Leo プログラムの全体像

Leo プログラムは、[プログラム本体](#program)・[定数](#constant)・[インポート](#import)・[トランジション関数](#transition-function)・[非同期関数](#async-function)・[補助関数](#helper-function)・[構造体](#struct)・[レコード](#record)・[マッピング](#mapping) の宣言で構成されます。
宣言は同じファイル内で参照できますが、別ファイルの宣言を利用する場合はインポートが必要です。

### プログラム {#program}

プログラムは Aleo ブロックチェーン上の [プログラム ID](#program-id) に配置される、関数などのコードと型定義をまとめたものです。宣言は `program {name}.{network} { ... }` の形式で、本文は波括弧 `{}` で囲みます。

```leo
import foo.aleo;

program hello.aleo {
    const FOO: u64 = 1u64;
    mapping account: address => u64;

    record Token {
        owner: address,
        amount: u64,
    }

    struct Message {
        sender: address,
        object: u64,
    }

    async transition mint_public(
        public receiver: address,
        public amount: u64,
    ) -> (Token, Future) {
        return (Token {
            owner: receiver,
            amount,
        }, update_state(receiver, amount));
    }

    async function update_state(
        public receiver: address,
        public amount: u64,
    ) {
        let current_amount: u64 = Mapping::get_or_use(account, receiver, 0u64);
        Mapping::set(account, receiver, current_amount + amount);
   }

    function compute(a: u64, b: u64) -> u64 {
        return a + b + FOO;
    }
}
```

Leo ファイル内でプログラムスコープに含める必要があるもの:

- constants
- mappings
- record types
- struct types
- transition functions
- helper functions
- async functions

プログラムスコープ外（グローバル）で宣言しなければならないもの:

- imports

#### プログラム ID {#program-id}

プログラム ID は `{name}.{network}` の形式です。

`name` の先頭文字は小文字である必要があります。利用できる文字は小文字アルファベット・数字・アンダースコアのみで、ダブルアンダースコア（`__`）や `aleo` という単語を含めてはいけません。

現在サポートされている `network` ドメインは `aleo` だけです。

```leo showLineNumbers
program hello.aleo; // valid

program Foo.aleo;   // invalid
program baR.aleo;   // invalid
program 0foo.aleo;  // invalid
program 0_foo.aleo; // invalid
program _foo.aleo;  // invalid
```

### 定数 {#constant}

定数は `const {name}: {type} = {expression};` の形で宣言します。  
定数は不変であり、宣言時に必ず値を代入する必要があります。  
グローバルスコープでも関数スコープでも宣言可能です。  

```leo
program foo.aleo {
    const FOO: u8 = 1u8;
    
    function bar() -> u8 {
        const BAR: u8 = 2u8;
        return FOO + BAR;
    }
}
```

### インポート {#import}

`imports` ディレクトリにダウンロードした依存プログラムをインポートできます。
宣言は `import {filename}.aleo;` の形式です。
依存解決器はネットワークまたはローカルファイルシステムから該当プログラムを取得します。

```leo showLineNumbers
import foo.aleo; // Import all `foo.aleo` declarations into the `hello.aleo` program.

program hello.aleo { }
```

### マッピング {#mapping}

マッピングは `mapping {name}: {key-type} => {value-type}` の書式で宣言します。
キーと値のペアを保持し、オンチェーンで保存されます。

```leo showLineNumbers
// On-chain storage of an `account` mapping,
// with `address` as the type of keys,
// and `u64` as the type of values.
mapping account: address => u64;
```

### 構造体 {#struct}

構造体は `struct {name} {}` で宣言し、`{name}: {type},` の形式でフィールドを列挙します。

```leo showLineNumbers
struct Array3 {
    a0: u32,
    a1: u32,
    a2: u32,
}
```

### レコード {#record}

[レコード](https://developer.aleo.org/concepts/fundamentals/records) は `record {name} {}` で宣言します。レコード名には `aleo` を含めてはならず、他のレコード名の接頭辞になってもいけません。

レコードのフィールドは `{visibility} {name}: {type},` の形式で記述します。フィールド名も `aleo` を含めてはいけません。 

可視性は `constant`・`public`・`private` のいずれかです。省略すると `private` が適用されます。

レコードには必ず `owner` フィールドを含める必要があります。プログラムにレコードを入力するときは `_nonce: group` フィールドも必要ですが、Leo のソースコードに明示する必要はなく、コンパイラが自動で補完します。

```aleo showLineNumbers
record Token {
    // The token owner.
    owner: address,
    // The token amount.
    amount: u64,
}
```

### トランジション関数 {#transition-function}

`transition` 関数はゼロ知識証明を生成し、Aleo ネットワークへ送信する公開インターフェースです。`transition {name}({inputs}) -> {outputs}` の形式で宣言し、ブロックチェーンとやり取りする際の入り口になります。

### 非同期関数 {#async-function}

`async function` はオンチェーンで遅延実行されるロジックをまとめるための構成要素です。`transition` から呼び出され、`Future` を返すことで finalize フェーズで状態を更新できます。

### 補助関数 {#helper-function}

`function` として宣言する通常の関数は、再利用したいロジックをまとめるために利用します。状態変更は行えませんが、同一プログラム内の他の関数やトランジションから参照できます。
