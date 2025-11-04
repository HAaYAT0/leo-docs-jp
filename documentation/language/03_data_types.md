---
id: data_types
title: データ型
sidebar_label: データ型
---
[general tags]: # (boolean, integer, field, group, scalar, address, signature, array, tuple, struct)

## 型推論
v2.7.0 以降、Leo は型推論をサポートしています。周囲の文脈から型を **一意に決定できる** 場合、コンパイラが変数や式の型を自動的に推論します。  

コンパイラが型を特定できない場合は、明示的に型注釈を指定してください。 

例:
```leo
let a: u8 = 2u8; // 明示的な型指定（OK）
let b = 2u8; // 型推論（OK）
let c : u8 = 2; // 型推論（OK）

let d = 2; // 型が曖昧なため不可
```

構造体のフィールドでも型推論が機能します。
```leo
struct Foo {
    x: u8
}

let f = Foo {
    x: 5, // `u8` と推論される
};
```


## データ型

### ブール値 {#booleans}

`true` と `false` のブール値をサポートします。

```leo
let b: bool = false;
let a = false;
```

### 整数 {#integers}

符号付き整数 `i8`・`i16`・`i32`・`i64`・`i128` と、符号なし整数 `u8`・`u16`・`u32`・`u64`・`u128` をサポートします。

```leo
let b: u8 = 1u8;
```

整数リテラルでは桁区切りとしてアンダースコア `_` を利用できます。

```leo
let n: u64 = 1_000_000u64;
```

:::info
ビット幅の大きい整数は回路内の制約数が増えるため、計算時間が伸びる可能性があります。
:::

#### Leo の整数に関する注意

Leo には既定の整数型が存在しません。すべての整数は **型注釈で明示** するか、コンパイラが **推論可能** な形で記述する必要があります。

```leo
let a: u8 = 2u8; // 明示的な型
let b: u16 = a as u16; // キャスト
```

### フィールド要素 {#field-elements}

楕円曲線の基礎体要素を表す `field` 型をサポートします。これは基礎体の法未満の非負整数で、以下が最小値と最大値の例です。

```leo
let a: field = 0field;
let b = 8444461749428370424248824938781546531375899335154063827935233455917409239040field;
let c: field = 0;
```

### グループ要素 {#group-elements}

楕円曲線上のアフィン点は群を形成します。Leo では生成元による部分群をプリミティブ型として扱えます。グループ要素は点の x 座標で表し、`2group` は点 `(2, 5553…56608)` を意味します。

```leo
let a: group = 0group; // x=0 の点 (0, 1)
let b = 1540945439182663264862696551825005342995406165131907382295858612069623286213group;  // 生成元
let c: group = 0;
```

生成元は `group::GEN` から取得できます。

```leo
let g: group = group::GEN;
```

### スカラー要素 {#scalar-elements}

楕円曲線部分群のスカラー体を表す `scalar` 型も利用できます。以下は最小値と最大値の例です。

```leo
let a: scalar = 0scalar;
let b = 2111115437357092606062206234695386632838870926408408195193685246394721360382scalar;
let c: scalar = 0;
```

### アドレス {#addresses}

アドレス型は、アドレスに対する解析や演算をコンパイラレベルで最適化するために定義されています。将来的に標準ライブラリによる補助機能も提供される予定です。

```leo
let sender: address = aleo1ezamst4pjgj9zfxqq0fwfj8a4cjuqndmasgata3hggzqygggnyfq6kmyd4;
let receiver = aleo129nrpl0dxh4evdsan3f4lyhz5pdgp6klrn5atp37ejlavswx5czsk0j5dj;
```

### 署名 {#signatures}

Aleo では Schnorr 署名を利用して秘密鍵でメッセージに署名します。Leo にはネイティブ型 `signature` があり、[`signature::verify`](./04_operators.md#signatureverify) や [`s.verify`](./04_operators.md#signatureverify) で検証できます。

```leo
program test.aleo {

    struct foo {
        a: u8,
        b: scalar
    }

    transition verify_field(s: signature, a: address, v: field) {
        let first: bool = signature::verify(s, a, v);
        let second: bool = s.verify(a, v);
        assert_eq(first, second);
    }

    transition verify_foo(s: signature, a: address, v: foo) {
        let first: bool = signature::verify(s, a, v);
        let second: bool = s.verify(a, v);
        assert_eq(first, second);
    }
}
```

### 配列 {#array}

静的配列をサポートします。配列型は `[type; length]` で宣言し、入れ子も可能です。長さ 0 の配列や可変配列はサポートされません。

インデックスアクセスは定数式だけが使用できます。

配列にはプリミティブ型・構造体・配列を格納でき、構造体やレコードのフィールドとして配列を持たせることもできます。for ループで配列を反復処理できます。

```leo
// 長さ 4 のブール配列
let arr: [bool; 4] = [true, false, true, false];

// ネストした配列
let nested: [[bool; 2]; 2] = [[true, false], [true, false]];

struct Bar {
    data: u8,
}

// 構造体の配列
let arr_of_structs: [Bar; 2] = [Bar { data: 1u8 }, Bar { data: 2u8 }];

// 配列内の構造体フィールドへアクセス
transition foo(a: [Bar; 8]) -> u8 {
    return a[0u8].data;
}

// 配列を含む構造体
struct Bat {
    data: [u8; 8],
}

// 配列を含むレコード
record Floo {
    owner: address,
    data: [u8; 8],
}

// 配列を値として持つマッピング
mapping data: address => [bool; 8];

// for ループで配列を走査して合計を求める
transition sum_with_loop(a: [u64; 4]) -> u64 {
    let sum: u64 = 0u64;
    for i: u8 in 0u8..4u8 {
        sum += a[i];
    }
    return sum;
}
```

### タプル {#tuple}

タプル型は `(type1, type2, ...)` で宣言し、入れ子にもできます。空タプルや要素の書き換えはサポートされていません。

要素へのアクセスは定数インデックスを用いたドット記法のみです。

タプルにはプリミティブ型・構造体・配列を格納でき、構造体やレコード内で利用することもできます。

```leo
program test.aleo {
    transition baz(foo: u8, bar: u8) -> u8 {
        let a: (u8, u8) = (foo, bar);
        let result: u8 = a.0 + a.1;
        return result;
    }
}
```

### 構造体 {#structs}

構造体は馴染みのあるシンタックスで宣言・生成できます。構造体名は依存関係も含めてグローバル名前空間で共有されるため、依存パッケージが `T` を定義していれば修飾なしで参照できます。

```leo
program test.aleo {
    struct S {
        x: field,
        y: u32,
    }

    transition foo(y: u32) -> S {
        let s: S = S {
            x: 172field,
            y,
        };
        return s;
    }
}
```

v3.0.0 以降は構造体で **const generics** を利用できます。
```leo
struct Matrix::[N: u32, M: u32] {
    data: [field; N * M],
}

// 利用例
let m = Matrix::[2, 2] { data: [0, 1, 2, 3] };
```
現時点ではジェネリック構造体をプログラム外からインポートすることはできませんが、サブモジュール内で宣言して利用することは可能です。const ジェネリック引数として使用できる型は整数型・`bool`・`scalar`・`group`・`field`・`address` です。
