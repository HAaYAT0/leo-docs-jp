---
id: operators
title: Operators and Expressions
sidebar_label: Operators and Expressions
---
[general tags]: # (operators, cryptographic_operators, assert, hash, commit, random, address, block)

## 演算子 {#operators}

Leo の演算子は 1 つ以上の式に基づいて値を計算します。
Leo では既定で検査付き算術が採用されており、オーバーフローやゼロ除算が検出されるとエラーが発生します。

たとえば加算は `first` に `second` を加え、結果を `destination` に格納します。
整数型ではオーバーフローを検査するための制約が追加されます。
整数型で桁あふれを許容する挙動が必要な場合は、演算子のラップ付きバリアントを参照してください。

```leo
let a: u8 = 1u8 + 1u8;
// a は 2 と等しい

a += 1u8;
// a は 3 になる

a = a.add(1u8);
// a は 4 になる
```

演算子の完全な一覧については [Operator Reference](./04_operators.md) を参照してください。

### 演算子の優先順位 {#operator-precedence}

演算子は次の優先順位に従って評価されます。

|                                   演算子                                    | 結合規則 |
| :---------------------------------------------------------------------------: | :-----------: |
|                                `!` `-`(unary)                                 |               |
|                                     `**`                                      | 右から左 |
|                                    `*` `/`                                    | 左から右 |
|                                `+` `-`(binary)                                | 左から右 |
|                                   `<<` `>>`                                   | 左から右 |
|                                      `&`                                      | 左から右 |
|                              <code>&#124;</code>                              | 左から右 |
|                                      `^`                                      | 左から右 |
|                               `<` `>` `<=` `>=`                               |               |
|                                   `==` `!=`                                   | 左から右 |
|                                     `&&`                                      | 左から右 |
|                           <code>&#124;&#124;</code>                           | 左から右 |
| `=` `+=` `-=` `*=` `/=` `%=` `**=` `<<=` `>>=` `&=` <code>&#124;=</code> `^=` |               |

### 括弧 {#parentheses}

評価の優先順位を変更したい場合は、式を括弧 `()` で囲みます。

```leo
let result = (a + 1u8) * 2u8;
```

`(a + 1u8)` が先に評価され、その後で `* 2u8` が実行されます。

## 文脈依存式 {#context-dependent-expressions}

Leo には、Aleo ブロックチェーンおよび現在のトランザクションに関する情報を参照できる式が用意されています。

### self.address

このプログラムのアドレスを返します。

```leo showLineNumbers
program test.aleo {
    transition get_program_address() -> address {
        return self.address;
    }
}
```

### self.caller

現在の `transition` を呼び出したアカウントまたはプログラムのアドレスを返します。

```leo showLineNumbers
program test.aleo {
    transition matches(addr: address) -> bool {
        return self.caller == addr;
    }
}
```

### self.signer

最上位の `transition` を呼び出したアカウントのアドレス、つまりトランザクションに署名したアカウントのアドレスを返します。

```leo showLineNumbers
program test.aleo {
    transition matches(addr: address) -> bool {
        return self.signer == addr;
    }
}
```

### block.height

現在のブロックの高さを返します。

:::info
`block.height` は [async function](#async-function) 内でのみ使用できます。
:::

```leo showLineNumbers
program test.aleo {
    async transition matches(height: u32) -> Future {
        return check_block_height(height);
    } 
    
    async function check_block_height(height: u32) {
        assert_eq(height, block.height);
    }
}
```

## コア関数 {#core-functions}

コア関数は Leo 言語に組み込まれている関数です。
検証や、ハッシュ・コミットメント・乱数生成などの暗号操作に利用されます。

### Assert と AssertEq {#assert-and-asserteq}

`assert` と `assert_eq` は条件が真であることを確認するための関数です。
条件が偽の場合、プログラムは失敗します。

```leo showLineNumbers
program test.aleo {
    transition matches() {
        assert(true);
        assert_eq(1u8, 1u8);
    }
}
```

### Hash {#hash}

Leo がサポートするハッシュアルゴリズムは `BHP256`, `BHP512`, `BHP768`, `BHP1024`, `Pedersen64`, `Pedersen128`, `Poseidon2`, `Poseidon4`, `Poseidon8`, `Keccak256`, `Keccak384`, `Keccak512`, `SHA3_256`, `SHA3_384`, `SHA3_512` です。  
ハッシュ関数の出力型は関数名で指定されます。たとえば `hash_to_group` は `group` 型を返します。
ハッシュ関数は任意の型を引数に取ることができます。

```leo showLineNumbers
let a: scalar = BHP256::hash_to_scalar(1u8);
let b: address = Pedersen64::hash_to_address(1u128);
let c: group = Poseidon2::hash_to_group(1field);
```

[すべてのハッシュ関数を参照](./04_operators.md#table-of-cryptographic-operators)

### Commit {#commit}

Leo がサポートするコミットメントアルゴリズムは `BHP256`, `BHP512`, `BHP768`, `BHP1024`, `Pedersen64`, `Pedersen128` です。  
コミットメント関数の出力型は関数名で指定されます。たとえば `commit_to_group` は `group` 型を返します。  
第 1 引数は任意の型を指定でき、第 2 引数はブラインディングファクターとして使われる `field` 型でなければなりません。

```leo showLineNumbers
let a: group = BHP256::commit_to_group(1u8, 2field);
let b: address = Pedersen64::commit_to_address(1u128, 2field);
```

[すべてのコミットメント関数を参照](./04_operators.md#table-of-cryptographic-operators)

### Random {#random}

Leo は乱数生成アルゴリズムとして `ChaCha` をサポートしています。  
乱数生成関数の出力型は関数名で指定されます。たとえば `rand_group` は `group` 型を返します。

:::info
乱数生成関数は [async function](#async-function) 内でのみ使用できます。
:::

```leo showLineNumbers
let a: group = ChaCha::rand_group();
let b: u32 = ChaCha::rand_u32();
```

[すべての乱数生成関数を参照](./04_operators.md#table-of-cryptographic-operators)

Leo でサポートされている標準演算子と暗号演算子を以下に示します。
Leo の演算子は Aleo Virtual Machine (AVM) で実行可能な [Aleo instruction opcode](https://developer.aleo.org/guides/aleo/opcodes) にコンパイルされます。

## 標準演算子の一覧 {#table-of-standard-operators}
| 名前                        | 説明                         |
|-----------------------------|:------------------------------------|
| [abs](#abs)                 | 絶対値                      |
| [abs_wrapped](#abs_wrapped) | ラップ付き絶対値             |
| [add](#add)                 | 加算                            |
| [add_wrapped](#add_wrapped) | ラップ付き加算                   |
| [and](#and)                 | 論理積                         |
| [assert](#assert)           | 真であることの検証                 |
| [assert_eq](#assert_eq)     | 等価であることの検証                     |
| [assert_neq](#assert_neq)   | 非等価であることの検証                 |
| [block.height](#block.height)| 最新ブロック高の取得      |
| [div](#div)                 | 除算                            |
| [div_wrapped](#div_wrapped) | ラップ付き除算         |
| [double](#double)           | 2 倍                              |
| [group::GEN](#groupgen)     | group の生成元                     |
| [gt](#gt)                   | より大きい比較             |
| [gte](#gte)                 | 以上の比較 |
| [inv](#inv)                 | 乗法逆元              |
| [eq](#eq)                   | 等価比較                 |
| [neq](#neq)                 | 非等価比較             |
| [lt](#lt)                   | より小さい比較                |
| [lte](#lte)                 | 以下の比較    |
| [mod](#mod)                 | 剰余                              |
| [mul](#mul)                 | 乗算                      |
| [mul_wrapped](#mul_wrapped) | ラップ付き乗算             |
| [nand](#nand)               | 否定された論理積                 |
| [neg](#neg)                 | 加法逆元                    |
| [nor](#nor)                 | 否定された論理和                 |
| [not](#not)                 | 否定                    |
| [or](#or)                   | （包含的）論理和             |
| [pow](#pow)                 | 累乗                      |
| [pow_wrapped](#pow_wrapped) | ラップ付き累乗             |
| [rem](#rem)                 | 剰余                           |
| [rem_wrapped](#rem_wrapped) | ラップ付き剰余                  |
| [shl](#shl)                 | 左シフト                          |
| [shl_wrapped](#shl_wrapped) | ラップ付き左シフト                 |
| [shr](#shr)                 | 右シフト                         |
| [shr_wrapped](#shr_wrapped) | ラップ付き右シフト                 |
| [square_root](#square_root) | 平方根                         |
| [square](#square)           | 平方                              |
| [sub](#sub)                 | 減算                         |
| [sub_wrapped](#sub_wrapped) | ラップ付き減算                |
| [to_x_coordinate](#to_x_coordinate) | グループ要素の x 座標を取得              |
| [to_y_coordinate](#to_y_coordinate) | グループ要素の y 座標を取得              |
| [sub_wrapped](#sub_wrapped) | ラップ付き減算                |
| [ternary](#ternary)         | 三項演算                      |
| [xor](#xor)                 | 排他的論理和               |

## 暗号演算子の一覧 {#table-of-cryptographic-operators}
| 名前                                                                    | 説明                       |
|-------------------------------------------------------------------------|:----------------------------------|
| [ChaCha::rand_destination](#chacharand_destination)                     | ChaCha による疑似乱数生成                        |
| [BHP256::commit_to_destination](#bhp256commit_to_destination)           | 256 ビット入力の BHP コミットメント      |
| [BHP512::commit_to_destination](#bhp512commit_to_destination)           | 512 ビット入力の BHP コミットメント      |
| [BHP768::commit_to_destination](#bhp768commit_to_destination)           | 768 ビット入力の BHP コミットメント      |
| [BHP1024::commit_to_destination](#bhp1024commit_to_destination)         | 1024 ビット入力の BHP コミットメント     |
| [Pedersen64::commit_to_destination](#pedersen64commit_to_destination)   | 64 ビット入力の Pedersen コミットメント  |
| [Pedersen128::commit_to_destination](#pedersen128commit_to_destination) | 128 ビット入力の Pedersen コミットメント |
| [BHP256::hash_to_destination](#bhp256hash_to_destination)               | 256 ビット入力の BHP ハッシュ            |
| [BHP512::hash_to_destination](#bhp512hash_to_destination)               | 512 ビット入力の BHP ハッシュ            |
| [BHP768::hash_to_destination](#bhp768hash_to_destination)               | 768 ビット入力の BHP ハッシュ            |
| [BHP1024::hash_to_destination](#bhp1024hash_to_destination)             | 1024 ビット入力の BHP ハッシュ           |
| [Keccak256::hash_to_destination](#keccak256hash_to_destination)         | 256 ビット入力の Keccak ハッシュ         |
| [Keccak384::hash_to_destination](#keccak384hash_to_destination)         | 384 ビット入力の Keccak ハッシュ         |
| [Keccak512::Hash_to_destination](#keccak512hash_to_destination)         | 512 ビット入力の Keccak ハッシュ         |
| [Pedersen64::hash_to_destination](#pedersen64hash_to_destination)       | 64 ビット入力の Pedersen ハッシュ        |
| [Pedersen128::hash_to_destination](#pedersen128hash_to_destination)     | 128 ビット入力の Pedersen ハッシュ       |
| [Poseidon2::hash_to_destination](#poseidon2hash_to_destination)         | 入力レート 2 の Poseidon ハッシュ   |
| [Poseidon4::hash_to_destination](#poseidon4hash_to_destination)         | 入力レート 4 の Poseidon ハッシュ   |
| [Poseidon8::hash_to_destination](#poseidon8hash_to_destination)         | 入力レート 8 の Poseidon ハッシュ   |
| [SHA3_256::hash_to_destination](#sha3_256hash_to_destination)           | 256 ビット入力の SHA3 ハッシュ           |
| [SHA3_384::hash_to_destination](#sha3_384hash_to_destination)           | 384 ビット入力の SHA3 ハッシュ           |
| [SHA3_512::hash_to_destination](#sha3_512hash_to_destination)           | 512 ビット入力の SHA3 ハッシュ           |
| [signature::verify](#signatureverify)                                   | 署名を検証                |

## 仕様 {#specification}

以下は Leo コンパイラにおける各演算子の仕様です。

### `abs`

```leo
let a: i8 = -1i8;
let b: i8 = a.abs(); // 1i8
```

#### 説明

入力の絶対値を計算し、オーバーフローを検査したうえで結果を出力先に格納します。

この演算がオーバーフローすると実行は停止します。整数型でラップ付きの挙動が必要な場合は [abs_wrapped](#abs_wrapped) 命令を利用してください。最小値をとる符号付き整数型に対して絶対値を取るとオーバーフローが発生します。たとえば `abs -128i8` は `i8` では `128` を表現できないためオーバーフローになります。

#### 対応している型

| 入力  | 出力先 |
|--------|:------------|
| `i8`   | `i8`        |
| `i16`  | `i16`       |
| `i32`  | `i32`       |
| `i64`  | `i64`       |
| `i128` | `i128`      |

[トップに戻る](#table-of-standard-operators)
***

### `abs_wrapped`

```leo
let a: i8 = -128i8;
let b: i8 = a.abs_wrapped(); // -128i8
```

#### 説明

入力の絶対値を計算し、型の範囲でラップさせた結果を出力先に格納します。

#### 対応している型

| 入力  | 出力先 |
|--------|:------------|
| `i8`   | `i8`        |
| `i16`  | `i16`       |
| `i32`  | `i32`       |
| `i64`  | `i64`       |
| `i128` | `i128`      |

[トップに戻る](#table-of-standard-operators)
***

### `add`

```leo
let a: u8 = 1u8;
let b: u8 = a + 1u8; // 2u8
let c: u8 = b.add(1u8); // 3u8
```

#### 説明

`first` に `second` を加算し、結果を `destination` に格納します。

この演算がオーバーフローすると実行は停止します。整数型でラップ付きの挙動が必要な場合は [add_wrapped](#add_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `field`     |
| `group`  | `group`  | `group`     |
| `i8`     | `i8`     | `i8`        |
| `i16`    | `i16`    | `i16`       |
| `i32`    | `i32`    | `i32`       |
| `i64`    | `i64`    | `i64`       |
| `i128`   | `i128`   | `i128`      |
| `u8`     | `u8`     | `u8`        |
| `u16`    | `u16`    | `u16`       |
| `u32`    | `u32`    | `u32`       |
| `u64`    | `u64`    | `u64`       |
| `u128`   | `u128`   | `u128`      |
| `scalar` | `scalar` | `scalar`    |

[トップに戻る](#table-of-standard-operators)
***

### `add_wrapped`

```leo
let a: u8 = 255u8;
let b: u8 = a.add_wrapped(1u8); // 0u8
```

#### 説明

`first` に `second` を加え、型の範囲を越える場合はラップさせた結果を `destination` に格納します。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `and`

```leo
let a: i8 = 1i8 & 1i8; // 1i8
let b: i8 = 1i8.and(2i8); // 0i8
```

#### 説明

整数（ビット演算）またはブール値の `first` と `second` に対して AND 演算を行い、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先 |
|-----------|----------|:------------|
| `bool`    | `bool`   | `bool`      |
| `i8`      | `i8`     | `i8`        |
| `i16`     | `i16`    | `i16`       |
| `i32`     | `i32`    | `i32`       |
| `i64`     | `i64`    | `i64`       |
| `i128`    | `i128`   | `i128`      |
| `u8`      | `u8`     | `u8`        |
| `u16`     | `u16`    | `u16`       |
| `u32`     | `u32`    | `u32`       |
| `u64`     | `u64`    | `u64`       |
| `u128`    | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `assert`

```leo
let a: bool = true;
let b: bool = false;

assert(a); // 正常に続行
assert(b); // プログラムが停止
```

#### 説明

式が `true` を返すか確認し、`false` の場合は実行を停止します。

#### 対応している型

| 式 |
|------------|
| `bool`  |

[トップに戻る](#table-of-standard-operators)
***

### `assert_eq`

```leo
let a: u8 = 1u8;
let b: u8 = 2u8;

assert_eq(a, a); // 正常に続行
assert_eq(a, b); // プログラムが停止
```

#### 説明

`first` と `second` が等しいことを検証し、等しくない場合は実行を停止します。

#### 対応している型

| 第 1 引数 | 第 2 引数 |
|-----------|-----------|
| `address` | `address` |
| `bool`    | `bool`    |
| `field`   | `field`   |
| `group`   | `group`   |
| `i8`      | `i8`      |
| `i16`     | `i16`     |
| `i32`     | `i32`     |
| `i64`     | `i64`     |
| `i128`    | `i128`    |
| `u8`      | `u8`      |
| `u16`     | `u16`     |
| `u32`     | `u32`     |
| `u64`     | `u64`     |
| `u128`    | `u128`    |
| `scalar`  | `scalar`  |

[トップに戻る](#table-of-standard-operators)
***

### `assert_neq`

```leo
let a: u8 = 1u8;
let b: u8 = 2u8;

assert_neq(a, b); // 正常に続行
assert_neq(a, a); // プログラムが停止
```

#### 説明

`first` と `second` が等しくないことを検証し、等しい場合は実行を停止します。

#### 対応している型

| 第 1 引数 | 第 2 引数 |
|-----------|-----------|
| `address` | `address` |
| `bool`    | `bool`    |
| `field`   | `field`   |
| `group`   | `group`   |
| `i8`      | `i8`      |
| `i16`     | `i16`     |
| `i32`     | `i32`     |
| `i64`     | `i64`     |
| `i128`    | `i128`    |
| `u8`      | `u8`      |
| `u16`     | `u16`     |
| `u32`     | `u32`     |
| `u64`     | `u64`     |
| `u128`    | `u128`    |
| `scalar`  | `scalar`  |

[トップに戻る](#table-of-standard-operators)
***

### `block.height`

```leo
async transition matches(height: u32) -> Future {
    return check_block_height(height);
} 

async function check_block_height(height: u32) {
    assert_eq(height, block.height);
}
```

#### 説明

`block.height` 演算子は Leo プログラム内で最新のブロック高を取得するために使用します。これはチェーン内のブロック数を表します。上記の例では、`block.height` を async 関数内で利用し、プログラム内で最新のブロック高を取得しています。

#### 注意
* `block.height` 演算子は async 関数内でのみ使用できます。async 関数の外で用いるとコンパイルエラーになります。
* `block.height` 演算子には引数はありません。

[トップに戻る](#table-of-standard-operators)
***

### `div`

```leo
let a: u8 = 4u8;
let b: u8 = a / 2u8; // 2u8
let c: u8 = b.div(2u8); // 1u8
```

#### 説明

第 1 オペランドを第 2 オペランドで除算し、結果を出力先に格納します。ゼロ除算が行われると実行は停止します。

整数型の場合、この演算は切り捨て除算を行います。切り捨て除算ではオペランドの符号に関係なく 0 に向かって丸められます。すなわち、小数部を切り捨て、絶対値が結果以下の最大の整数を返します。

例:

- `7 / 3` は `2` を返し、`2.3333` にはなりません。
- `-7 / 3` は `-2` を返し、`-2.3333` にはなりません。

また、符号付き整数型の最小値を `-1` で割るとアンダーフローが発生するため、実行は停止します。たとえば `-128i8 / -1i8` は `i8` で `128` を表現できないためアンダーフローになります。

`field` 型では、`b = 0field` の場合を除き、除算 `a / b` は常に定義されています。

整数型でラップ付きの挙動が必要な場合は [div_wrapped](#div_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数   | 第 2 引数  | 出力先 |
|---------|---------|:------------|
| `field` | `field` | `field`     |
| `i8`    | `i8`    | `i8`        |
| `i16`   | `i16`   | `i16`       |
| `i32`   | `i32`   | `i32`       |
| `i64`   | `i64`   | `i64`       |
| `i128`  | `i128`  | `i128`      |
| `u8`    | `u8`    | `u8`        |
| `u16`   | `u16`   | `u16`       |
| `u32`   | `u32`   | `u32`       |
| `u64`   | `u64`   | `u64`       |
| `u128`  | `u128`  | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `div_wrapped`

```leo
let a: i8 = -128i8;
let b: i8 = a.div_wrapped(-1i8); // -128i8
```

#### 説明

`first` を `second` で除算し、型の範囲でラップさせた結果を `destination` に格納します。`second` がゼロの場合は実行が停止します。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `double`

```leo
let a: group = 2group;
let b: group = a.double();
```

#### 説明

入力に自身を加算し、その結果を `destination` に格納します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `field` | `field`     |
| `group` | `group`     |

[トップに戻る](#table-of-standard-operators)
***

### `group::GEN`

```leo
let a: group = group::GEN;
```

#### 説明

`group` 型が表す代数的グループの生成元を返します。

Leo のコンパイルは楕円曲線を基盤としており、その点はグループを形成します。また、その曲線上の特定の点が部分群を生成し、その要素が `group` 型を構成します。

これは関数ではなく定数であり、入力は取らず出力のみを返します。

関連定数として `GEN` が定義されており、対応する型は `group` です。

#### 対応している型

| 出力先 |
|-------------|
| `group`     |

[トップに戻る](#table-of-standard-operators)
***

### `gt`

```leo
let a: bool = 2u8 > 1u8; // true
let b: bool = 1u8.gt(1u8); // false
```

#### 説明

`first` が `second` より大きいか確認し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `bool`   |
| `i8`     | `i8`     | `bool`   |
| `i16`    | `i16`    | `bool`   |
| `i32`    | `i32`    | `bool`   |
| `i64`    | `i64`    | `bool`   |
| `i128`   | `i128`   | `bool`   |
| `u8`     | `u8`     | `bool`   |
| `u16`    | `u16`    | `bool`   |
| `u32`    | `u32`    | `bool`   |
| `u64`    | `u64`    | `bool`   |
| `u128`   | `u128`   | `bool`   |
| `scalar` | `scalar` | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `gte`

```leo
let a: bool = 2u8 >= 1u8; // true
let b: bool = 1u8.gte(1u8); // true
```

#### 説明

`first` が `second` 以上か確認し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `bool`   |
| `i8`     | `i8`     | `bool`   |
| `i16`    | `i16`    | `bool`   |
| `i32`    | `i32`    | `bool`   |
| `i64`    | `i64`    | `bool`   |
| `i128`   | `i128`   | `bool`   |
| `u8`     | `u8`     | `bool`   |
| `u16`    | `u16`    | `bool`   |
| `u32`    | `u32`    | `bool`   |
| `u64`    | `u64`    | `bool`   |
| `u128`   | `u128`   | `bool`   |
| `scalar` | `scalar` | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `inv`

```leo
let a: field = 1field.inv();
```

#### 説明

入力の乗法逆元を計算し、結果を `destination` に格納します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `field` | `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `eq`

```leo
let a: bool = 1u8 == 1u8; // true
let b: bool = 1u8.eq(2u8); // false
```

#### 説明

`first` と `second` が等しいか比較し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数       | 第 2 引数      | 出力先 |
|-------------|-------------|-------------|
| `address`   | `address`   | `bool`   |
| `bool`      | `bool`      | `bool`   |
| `field`     | `field`     | `bool`   |
| `group`     | `group`     | `bool`   |
| `i8`        | `i8`        | `bool`   |
| `i16`       | `i16`       | `bool`   |
| `i32`       | `i32`       | `bool`   |
| `i64`       | `i64`       | `bool`   |
| `i128`      | `i128`      | `bool`   |
| `u8`        | `u8`        | `bool`   |
| `u16`       | `u16`       | `bool`   |
| `u32`       | `u32`       | `bool`   |
| `u64`       | `u64`       | `bool`   |
| `u128`      | `u128`      | `bool`   |
| `scalar`    | `scalar`    | `bool`   |
| `Signature` | `Signature` | `bool`   |
| `struct`    | `struct`    | `bool`   |
| `Record`    | `Record`    | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `neq`

```leo
let a: bool = 1u8 != 1u8; // false
let b: bool = 1u8.neq(2u8); // true
```

#### 説明

`first` と `second` が等しくないか比較し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数       | 第 2 引数      | 出力先 |
|-------------|-------------|-------------|
| `address`   | `address`   | `bool`   |
| `bool`      | `bool`      | `bool`   |
| `field`     | `field`     | `bool`   |
| `group`     | `group`     | `bool`   |
| `i8`        | `i8`        | `bool`   |
| `i16`       | `i16`       | `bool`   |
| `i32`       | `i32`       | `bool`   |
| `i64`       | `i64`       | `bool`   |
| `i128`      | `i128`      | `bool`   |
| `u8`        | `u8`        | `bool`   |
| `u16`       | `u16`       | `bool`   |
| `u32`       | `u32`       | `bool`   |
| `u64`       | `u64`       | `bool`   |
| `u128`      | `u128`      | `bool`   |
| `scalar`    | `scalar`    | `bool`   |
| `Signature` | `Signature` | `bool`   |
| `struct`    | `struct`    | `bool`   |
| `Record`    | `Record`    | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `lt`

```leo
let a: bool = 1u8 < 2u8; // true
let b: bool = 1u8.lt(1u8); // false
```

#### 説明

`first` が `second` より小さいか確認し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `bool`   |
| `i8`     | `i8`     | `bool`   |
| `i16`    | `i16`    | `bool`   |
| `i32`    | `i32`    | `bool`   |
| `i64`    | `i64`    | `bool`   |
| `i128`   | `i128`   | `bool`   |
| `u8`     | `u8`     | `bool`   |
| `u16`    | `u16`    | `bool`   |
| `u32`    | `u32`    | `bool`   |
| `u64`    | `u64`    | `bool`   |
| `u128`   | `u128`   | `bool`   |
| `scalar` | `scalar` | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `lte`

```leo
let a: bool = 1u8 <= 2u8; // true
let b: bool = 1u8.lte(1u8); // true
```

#### 説明

`first` が `second` 以下か確認し、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `bool`   |
| `i8`     | `i8`     | `bool`   |
| `i16`    | `i16`    | `bool`   |
| `i32`    | `i32`    | `bool`   |
| `i64`    | `i64`    | `bool`   |
| `i128`   | `i128`   | `bool`   |
| `u8`     | `u8`     | `bool`   |
| `u16`    | `u16`    | `bool`   |
| `u32`    | `u32`    | `bool`   |
| `u64`    | `u64`    | `bool`   |
| `u128`   | `u128`   | `bool`   |
| `scalar` | `scalar` | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `mod`

```leo
let a: u8 = 5u8 % 2u8; // 1u8
let b: u8 = 5u8.mod(2u8); // 1u8
```

#### 説明

`first` を `second` で割った剰余を計算し、結果を `destination` に格納します。`second` がゼロの場合は実行を停止します。

#### 対応している型

| 第 1 引数   | 第 2 引数  | 出力先 |
|---------|---------|:------------|
| `field` | `field` | `field`     |
| `i8`    | `i8`    | `i8`        |
| `i16`   | `i16`   | `i16`       |
| `i32`   | `i32`   | `i32`       |
| `i64`   | `i64`   | `i64`       |
| `i128`  | `i128`  | `i128`      |
| `u8`    | `u8`    | `u8`        |
| `u16`   | `u16`   | `u16`       |
| `u32`   | `u32`   | `u32`       |
| `u64`   | `u64`   | `u64`       |
| `u128`  | `u128`  | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `mul`

```leo
let a: u8 = 1u8 * 2u8; // 2u8
let b: u8 = a.mul(2u8); // 4u8
```

#### 説明

`first` と `second` を乗算し、結果を `destination` に格納します。

この演算でオーバーフローが発生すると実行は停止します。整数型でラップ付きの挙動が必要な場合は [mul_wrapped](#mul_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `field`     |
| `group`  | `group`  | `group`     |
| `i8`     | `i8`     | `i8`        |
| `i16`    | `i16`    | `i16`       |
| `i32`    | `i32`    | `i32`       |
| `i64`    | `i64`    | `i64`       |
| `i128`   | `i128`   | `i128`      |
| `u8`     | `u8`     | `u8`        |
| `u16`    | `u16`    | `u16`       |
| `u32`    | `u32`    | `u32`       |
| `u64`    | `u64`    | `u64`       |
| `u128`   | `u128`   | `u128`      |
| `scalar` | `scalar` | `scalar`    |

[トップに戻る](#table-of-standard-operators)
***

### `mul_wrapped`

```leo
let a: u8 = 255u8;
let b: u8 = a.mul_wrapped(2u8); // 254u8
```

#### 説明

`first` と `second` を乗算し、型の範囲を越える場合はラップさせた結果を `destination` に格納します。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `nand`

```leo
let a: bool = true nand true; // false
let b: bool = true.nand(false); // true
```

#### 説明

ブール値または整数の `first` と `second` に対して NAND 演算を行い、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先 |
|-----------|----------|:------------|
| `bool`    | `bool`   | `bool`      |
| `i8`      | `i8`     | `i8`        |
| `i16`     | `i16`    | `i16`       |
| `i32`     | `i32`    | `i32`       |
| `i64`     | `i64`    | `i64`       |
| `i128`    | `i128`   | `i128`      |
| `u8`      | `u8`     | `u8`        |
| `u16`     | `u16`    | `u16`       |
| `u32`     | `u32`    | `u32`       |
| `u64`     | `u64`    | `u64`       |
| `u128`    | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `neg`

```leo
let a: i8 = -1i8;
let b: i8 = a.neg(); // 1i8
```

#### 説明

入力の加法逆元を計算し、結果を `destination` に格納します。

#### 対応している型

| 入力  | 出力先 |
|--------|-------------|
| `i8`   | `i8`        |
| `i16`  | `i16`       |
| `i32`  | `i32`       |
| `i64`  | `i64`       |
| `i128` | `i128`      |
| `field`| `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `nor`

```leo
let a: bool = true nor false; // false
let b: bool = false.nor(false); // true
```

#### 説明

ブール値または整数の `first` と `second` に対して NOR 演算を行い、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先 |
|-----------|----------|:------------|
| `bool`    | `bool`   | `bool`      |
| `i8`      | `i8`     | `i8`        |
| `i16`     | `i16`    | `i16`       |
| `i32`     | `i32`    | `i32`       |
| `i64`     | `i64`    | `i64`       |
| `i128`    | `i128`   | `i128`      |
| `u8`      | `u8`     | `u8`        |
| `u16`     | `u16`    | `u16`       |
| `u32`     | `u32`    | `u32`       |
| `u64`     | `u64`    | `u64`       |
| `u128`    | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `not`

```leo
let a: bool = true;
let b: bool = a.not(); // false
```

#### 説明

ブール値または整数のビットを反転し、結果を `destination` に格納します。

#### 対応している型

| 入力     | 出力先 |
|-----------|:------------|
| `bool`    | `bool`      |
| `i8`      | `i8`        |
| `i16`     | `i16`       |
| `i32`     | `i32`       |
| `i64`     | `i64`       |
| `i128`    | `i128`      |
| `u8`      | `u8`        |
| `u16`     | `u16`       |
| `u32`     | `u32`       |
| `u64`     | `u64`       |
| `u128`    | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `or`

```leo
let a: bool = true or false; // true
let b: bool = true.or(false); // true
```

#### 説明

ブール値または整数の `first` と `second` に対して OR 演算を行い、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先 |
|-----------|----------|:------------|
| `bool`    | `bool`   | `bool`      |
| `i8`      | `i8`     | `i8`        |
| `i16`     | `i16`    | `i16`       |
| `i32`     | `i32`    | `i32`       |
| `i64`     | `i64`    | `i64`       |
| `i128`    | `i128`   | `i128`      |
| `u8`      | `u8`     | `u8`        |
| `u16`     | `u16`    | `u16`       |
| `u32`     | `u32`    | `u32`       |
| `u64`     | `u64`    | `u64`       |
| `u128`    | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `pow`

```leo
let a: u8 = 2u8 ** 2u8; // 4u8
let b: u8 = a.pow(2u8); // 16u8
```

#### 説明

`first` を `second` 乗し、結果を `destination` に格納します。

整数型でオーバーフローが発生すると実行が停止します。整数型でラップ付きの挙動が必要な場合は [pow_wrapped](#pow_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `field`     |
| `i8`     | `i8`     | `i8`        |
| `i16`    | `i16`    | `i16`       |
| `i32`    | `i32`    | `i32`       |
| `i64`    | `i64`    | `i64`       |
| `i128`   | `i128`   | `i128`      |
| `u8`     | `u8`     | `u8`        |
| `u16`    | `u16`    | `u16`       |
| `u32`    | `u32`    | `u32`       |
| `u64`    | `u64`    | `u64`       |
| `u128`   | `u128`   | `u128`      |
| `scalar` | `scalar` | `scalar`    |

[トップに戻る](#table-of-standard-operators)
***

### `pow_wrapped`

```leo
let a: u8 = 2u8;
let b: u8 = a.pow_wrapped(8u8); // 0u8
```

#### 説明

`first` を `second` 乗し、型の範囲を越える場合はラップさせた結果を `destination` に格納します。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `rem`

```leo
let a: i8 = 5i8 % 2i8; // 1i8
let b: i8 = a.rem(2i8); // 1i8
```

#### 説明

`first` を `second` で割った余りを計算し、結果を `destination` に格納します。`second` がゼロの場合は実行を停止します。剰余は `first` の符号と同じ符号を持ちます。

整数型でラップ付きの挙動が必要な場合は [rem_wrapped](#rem_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `i8`     | `i8`     | `i8`        |
| `i16`    | `i16`    | `i16`       |
| `i32`    | `i32`    | `i32`       |
| `i64`    | `i64`    | `i64`       |
| `i128`   | `i128`   | `i128`      |
| `u8`     | `u8`     | `u8`        |
| `u16`    | `u16`    | `u16`       |
| `u32`    | `u32`    | `u32`       |
| `u64`    | `u64`    | `u64`       |
| `u128`   | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `rem_wrapped`

```leo
let a: i8 = -128i8;
let b: i8 = a.rem_wrapped(3i8); // -1i8
```

#### 説明

`first` を `second` で割った余りを切り捨て除算の規則に従って計算し、結果を `destination` に格納します。`second` がゼロの場合は実行を停止します。
[`rem`](#rem) とは異なり、`rem_wrapped` は常に定義されており、[`div`](#div) がラップを引き起こす場面でも停止しません。

`rem_wrapped` 自体が新たにラップを導入するわけではなく、`rem` が未定義となるケースでも演算を完了できるようにします。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `signature::verify`

```leo
transition verify_field(s: signature, a: address, v: field) {
    let first: bool = signature::verify(s, a, v);
    let second: bool = s.verify(a, v);
    assert_eq(first, second);
}
```

#### 説明

署名 `first` がアドレス `second` によってフィールド `third` を対象に署名されたものであるか検証し、結果を `destination` に格納します。この検証は [Schnorr 署名スキーム](https://en.wikipedia.org/wiki/Schnorr_signature) に従います。これは、署名者がランダムなノンスを生成してコミットし、ハッシュ関数でチャレンジを計算し、ノンス・チャレンジ・秘密鍵を組み合わせて署名を生成するデジタル署名方式です。検証者はチャレンジを再計算して公開鍵とメッセージとの整合性を確認することで署名の正当性を確かめます。

#### 対応している型

`Message` は任意のリテラル型または `struct` 型です。

| 第 1 引数       | 第 2 引数    | 第 3 引数     | 出力先 |
|-------------|-----------|-----------|-------------|
| `signature` | `address` | `Message` | `bool`   |

[トップに戻る](#table-of-standard-operators)
***

### `shl`

```leo
let a: u8 = 1u8 << 1u8; // 2u8
let b: u8 = a.shl(1u8); // 4u8
```

#### 説明

`first` を `second` ビット左にシフトし、結果を `destination` に格納します。シフト量が `first` のビット幅を超える場合、またはシフト後の値が `first` の型に収まらない場合は実行が停止します。

#### 対応している型

`Magnitude` には `u8`, `u16`, `u32` のいずれかを指定できます。

| 第 1 引数  | 第 2 引数      | 出力先 |
|--------|-------------|-------------|
| `i8`   | `Magnitude` | `i8`        |
| `i16`  | `Magnitude` | `i16`       |
| `i32`  | `Magnitude` | `i32`       |
| `i64`  | `Magnitude` | `i64`       |
| `i128` | `Magnitude` | `i128`      |
| `u8`   | `Magnitude` | `u8`        |
| `u16`  | `Magnitude` | `u16`       |
| `u32`  | `Magnitude` | `u32`       |
| `u64`  | `Magnitude` | `u64`       |
| `u128` | `Magnitude` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `shl_wrapped`

```leo
let a: u8 = 128u8.shl_wrapped(1u8); // 0u8
let b: i8 = 64i8.shl_wrapped(2u8); // -128i8
```

#### 説明

`first` を `second` ビット左にシフトし、型の範囲に合わせてラップさせた結果を `destination` に格納します。シフト量は `first` のビット幅でマスクされるため、`n` ビットのシフトは `n % bit_size` ビットのシフトと同値です。

ビットが型の範囲外に押し出された場合、それらは切り捨てられ、符号付き整数では符号が変わることがあります。

#### 対応している型

`Magnitude` には `u8`, `u16`, `u32` のいずれかを指定できます。

| 第 1 引数  | 第 2 引数      | 出力先 |
|--------|-------------|-------------|
| `i8`   | `Magnitude` | `i8`        |
| `i16`  | `Magnitude` | `i16`       |
| `i32`  | `Magnitude` | `i32`       |
| `i64`  | `Magnitude` | `i64`       |
| `i128` | `Magnitude` | `i128`      |
| `u8`   | `Magnitude` | `u8`        |
| `u16`  | `Magnitude` | `u16`       |
| `u32`  | `Magnitude` | `u32`       |
| `u64`  | `Magnitude` | `u64`       |
| `u128` | `Magnitude` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `shr`

```leo
let a: u8 = 4u8 >> 1u8; // 2u8
let b: u8 = a.shr(1u8); // 1u8
```

#### 説明

`first` を `second` ビット右にシフトし、結果を `destination` に格納します。シフト量が `first` のビット幅を超える場合は実行が停止します。

#### 対応している型

`Magnitude` には `u8`, `u16`, `u32` のいずれかを指定できます。

| 第 1 引数  | 第 2 引数      | 出力先 |
|--------|-------------|-------------|
| `i8`   | `Magnitude` | `i8`        |
| `i16`  | `Magnitude` | `i16`       |
| `i32`  | `Magnitude` | `i32`       |
| `i64`  | `Magnitude` | `i64`       |
| `i128` | `Magnitude` | `i128`      |
| `u8`   | `Magnitude` | `u8`        |
| `u16`  | `Magnitude` | `u16`       |
| `u32`  | `Magnitude` | `u32`       |
| `u64`  | `Magnitude` | `u64`       |
| `u128` | `Magnitude` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `shr_wrapped`

```leo
let a: u8 = 128u8.shr_wrapped(7u8); // 1u8
```

#### 説明

`first` を `second` ビット右にシフトし、型の範囲に合わせてラップさせた結果を `destination` に格納します。シフト量は `first` のビット幅でマスクされるため、`n` ビットのシフトは `n % bit_size` ビットのシフトと同値です。

#### 対応している型

`Magnitude` には `u8`, `u16`, `u32` のいずれかを指定できます。

| 第 1 引数  | 第 2 引数      | 出力先 |
|--------|-------------|-------------|
| `i8`   | `Magnitude` | `i8`        |
| `i16`  | `Magnitude` | `i16`       |
| `i32`  | `Magnitude` | `i32`       |
| `i64`  | `Magnitude` | `i64`       |
| `i128` | `Magnitude` | `i128`      |
| `u8`   | `Magnitude` | `u8`        |
| `u16`  | `Magnitude` | `u16`       |
| `u32`  | `Magnitude` | `u32`       |
| `u64`  | `Magnitude` | `u64`       |
| `u128` | `Magnitude` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `square`

```leo
let a: field = 2field.square(); // 4field
```

#### 説明

入力を自乗し、結果を `destination` に格納します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `field` | `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `square_root`

```leo
let a: field = 4field.square_root(); // 2field
```

#### 説明

入力の平方根を計算し、結果を `destination` に格納します。平方根が存在しない場合は実行が停止します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `field` | `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `sub`

```leo
let a: u8 = 3u8 - 1u8; // 2u8
let b: u8 = a.sub(1u8); // 1u8
```

#### 説明

`first` から `second` を減算し、結果を `destination` に格納します。

この演算でオーバーフローが発生すると実行は停止します。整数型でラップ付きの挙動が必要な場合は [sub_wrapped](#sub_wrapped) 命令を利用してください。

#### 対応している型

| 第 1 引数    | 第 2 引数   | 出力先 |
|----------|----------|-------------|
| `field`  | `field`  | `field`     |
| `group`  | `group`  | `group`     |
| `i8`     | `i8`     | `i8`        |
| `i16`    | `i16`    | `i16`       |
| `i32`    | `i32`    | `i32`       |
| `i64`    | `i64`    | `i64`       |
| `i128`   | `i128`   | `i128`      |
| `u8`     | `u8`     | `u8`        |
| `u16`    | `u16`    | `u16`       |
| `u32`    | `u32`    | `u32`       |
| `u64`    | `u64`    | `u64`       |
| `u128`   | `u128`   | `u128`      |
| `scalar` | `scalar` | `scalar`    |

[トップに戻る](#table-of-standard-operators)
***

### `sub_wrapped`

```leo
let a: u8 = 0u8;
let b: u8 = a.sub_wrapped(1u8); // 255u8
```

#### 説明

`first` から `second` を減算し、型の範囲を越える場合はラップさせた結果を `destination` に格納します。

#### 対応している型

| 第 1 引数  | 第 2 引数 | 出力先 |
|--------|--------|:------------|
| `i8`   | `i8`   | `i8`        |
| `i16`  | `i16`  | `i16`       |
| `i32`  | `i32`  | `i32`       |
| `i64`  | `i64`  | `i64`       |
| `i128` | `i128` | `i128`      |
| `u8`   | `u8`   | `u8`        |
| `u16`  | `u16`  | `u16`       |
| `u32`  | `u32`  | `u32`       |
| `u64`  | `u64`  | `u64`       |
| `u128` | `u128` | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `ternary`

```leo
let a: u8 = ternary(true, 1u8, 2u8); // 1u8
let b: u8 = ternary(false, 1u8, 2u8); // 2u8
```

#### 説明

`condition` が `true` の場合は `first` を、`false` の場合は `second` を選択し、結果を `destination` に格納します。

#### 対応している型

| 条件   | 第 1 引数 | 第 2 引数 | 出力先 |
|--------|-----------|-----------|-------------|
| `bool` | `T`       | `T`       | `T`         |

`T` は任意の型を表します。

[トップに戻る](#table-of-standard-operators)
***

### `to_x_coordinate`

```leo
let a: field = (2group).to_x_coordinate();
```

#### 説明

グループ要素の x 座標を抽出し、結果を `destination` に格納します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `group` | `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `to_y_coordinate`

```leo
let a: field = (2group).to_y_coordinate();
```

#### 説明

グループ要素の y 座標を抽出し、結果を `destination` に格納します。

#### 対応している型

| 入力   | 出力先 |
|---------|-------------|
| `group` | `field`     |

[トップに戻る](#table-of-standard-operators)
***

### `xor`

```leo
let a: bool = true xor false; // true
let b: bool = true.xor(true); // false
```

#### 説明

ブール値または整数の `first` と `second` に対して XOR 演算を行い、結果を `destination` に格納します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先 |
|-----------|----------|:------------|
| `bool`    | `bool`   | `bool`      |
| `i8`      | `i8`     | `i8`        |
| `i16`     | `i16`    | `i16`       |
| `i32`     | `i32`    | `i32`       |
| `i64`     | `i64`    | `i64`       |
| `i128`    | `i128`   | `i128`      |
| `u8`      | `u8`     | `u8`        |
| `u16`     | `u16`    | `u16`       |
| `u32`     | `u32`    | `u32`       |
| `u64`     | `u64`    | `u64`       |
| `u128`    | `u128`   | `u128`      |

[トップに戻る](#table-of-standard-operators)
***

### `ChaCha::rand_DESTINATION`

```leo
let result: address = ChaCha::rand_address();
let result: bool = ChaCha::rand_bool();
let result: field = ChaCha::rand_field();
let result: group = ChaCha::rand_group();
let result: i8 = ChaCha::rand_i8();
let result: i16 = ChaCha::rand_i16();
let result: i32 = ChaCha::rand_i32();
let result: i64 = ChaCha::rand_i64();
let result: i128 = ChaCha::rand_i128();
let result: u8 = ChaCha::rand_u8();
let result: u16 = ChaCha::rand_u16();
let result: u32 = ChaCha::rand_u32();
let result: u64 = ChaCha::rand_u64();
let result: u128 = ChaCha::rand_u128();
let result: scalar = ChaCha::rand_scalar();
```

#### 説明

出力先で指定した型の乱数を返します。  
**この操作は async 関数内でのみ使用できます。**

#### 対応している型

| 出力先 |
|-------------|
| `address`   |
| `bool`      |
| `field`     |
| `group`     |
| `i8`        |
| `i16`       |
| `i32`       |
| `i64`       |
| `i128`      |
| `u8`        |
| `u16`       |
| `u32`       |
| `u64`       |
| `u128`      |
| `scalar`    |

[トップに戻る](#table-of-standard-operators)
***

### `BHP256::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = BHP256::commit_to_address(1u8, salt);
let b: field = BHP256::commit_to_field(2i64, salt);
let c: group = BHP256::commit_to_group(1field, salt);
```

#### 説明

`first` を 256 ビットチャンクごとに処理し、`second` で与えられた乱数を用いて Bowe-Hopwood-Pedersen コミットメントを計算し、結果を `destination` に格納します。乱数は常に `scalar` 型である必要があり、生成されるコミットメントは `address`、`field`、または `group` のいずれかになります。

入力が 129 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `address` | `scalar` | `address`, `field`, `group` |
| `bool`    | `scalar` | `address`, `field`, `group` |
| `field`   | `scalar` | `address`, `field`, `group` |
| `group`   | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `i64`     | `scalar` | `address`, `field`, `group` |
| `i128`    | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `u64`     | `scalar` | `address`, `field`, `group` |
| `u128`    | `scalar` | `address`, `field`, `group` |
| `scalar`  | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP512::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = BHP512::commit_to_address(1u8, salt);
let b: field = BHP512::commit_to_field(2i64, salt);
let c: group = BHP512::commit_to_group(1field, salt);
```

#### 説明

`first` を 512 ビットチャンクごとに処理し、`second` で与えられた乱数を用いて Bowe-Hopwood-Pedersen コミットメントを計算し、結果を `destination` に格納します。乱数は常に `scalar` 型である必要があり、生成されるコミットメントは常に `group` 型になります。

入力が 171 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `address` | `scalar` | `address`, `field`, `group` |
| `bool`    | `scalar` | `address`, `field`, `group` |
| `field`   | `scalar` | `address`, `field`, `group` |
| `group`   | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `i64`     | `scalar` | `address`, `field`, `group` |
| `i128`    | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `u64`     | `scalar` | `address`, `field`, `group` |
| `u128`    | `scalar` | `address`, `field`, `group` |
| `scalar`  | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP768::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = BHP768::commit_to_address(1u8, salt);
let b: field = BHP768::commit_to_field(2i64, salt);
let c: group = BHP768::commit_to_group(1field, salt);
```

#### 説明

`first` を 768 ビットチャンクごとに処理し、`second` で与えられた乱数を用いて Bowe-Hopwood-Pedersen コミットメントを計算し、結果を `destination` に格納します。乱数は常に `scalar` 型でなければならず、生成されるコミットメントは常に `group` 型になります。

入力が 129 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `address` | `scalar` | `address`, `field`, `group` |
| `bool`    | `scalar` | `address`, `field`, `group` |
| `field`   | `scalar` | `address`, `field`, `group` |
| `group`   | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `i64`     | `scalar` | `address`, `field`, `group` |
| `i128`    | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `u64`     | `scalar` | `address`, `field`, `group` |
| `u128`    | `scalar` | `address`, `field`, `group` |
| `scalar`  | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP1024::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = BHP1024::commit_to_address(1u8, salt);
let b: field = BHP1024::commit_to_field(2i64, salt);
let c: group = BHP1024::commit_to_group(1field, salt);
```

#### 説明

`first` を 1024 ビットチャンクごとに処理し、`second` で与えられた乱数を用いて Bowe-Hopwood-Pedersen コミットメントを計算し、結果を `destination` に格納します。乱数は常に `scalar` 型でなければならず、生成されるコミットメントは常に `group` 型になります。

入力が 171 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `address` | `scalar` | `address`, `field`, `group` |
| `bool`    | `scalar` | `address`, `field`, `group` |
| `field`   | `scalar` | `address`, `field`, `group` |
| `group`   | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `i64`     | `scalar` | `address`, `field`, `group` |
| `i128`    | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `u64`     | `scalar` | `address`, `field`, `group` |
| `u128`    | `scalar` | `address`, `field`, `group` |
| `scalar`  | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `Pedersen64::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = Pedersen64::commit_to_address(1u8, salt);
let b: field = Pedersen64::commit_to_field(2i64, salt);
let c: group = Pedersen64::commit_to_group(1field, salt);
```

#### 説明

`first` の最大 64 ビットまでの入力に対して Pedersen コミットメントを計算し、`second` で与えられた乱数とともに `destination` に格納します。乱数は常に `scalar` 型でなければならず、生成されるコミットメントは常に `group` 型になります。

`struct` の値が 64 ビットの上限を超える場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `bool`    | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `Pedersen128::commit_to_DESTINATION`

```leo
let salt: scalar = ChaCha::rand_scalar();
let a: address = Pedersen128::commit_to_address(1u8, salt);
let b: field = Pedersen128::commit_to_field(2i64, salt);
let c: group = Pedersen128::commit_to_group(1field, salt);
```

#### 説明

`first` の最大 128 ビットまでの入力に対して Pedersen コミットメントを計算し、`second` で与えられた乱数とともに `destination` に格納します。乱数は常に `scalar` 型でなければならず、生成されるコミットメントは常に `group` 型になります。

`struct` の値が 128 ビットの上限を超える場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 第 2 引数   | 出力先                 |
|-----------|----------|:----------------------------|
| `bool`    | `scalar` | `address`, `field`, `group` |
| `i8`      | `scalar` | `address`, `field`, `group` |
| `i16`     | `scalar` | `address`, `field`, `group` |
| `i32`     | `scalar` | `address`, `field`, `group` |
| `i64`     | `scalar` | `address`, `field`, `group` |
| `u8`      | `scalar` | `address`, `field`, `group` |
| `u16`     | `scalar` | `address`, `field`, `group` |
| `u32`     | `scalar` | `address`, `field`, `group` |
| `u64`     | `scalar` | `address`, `field`, `group` |
| `struct`  | `scalar` | `address`, `field`, `group` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP256::hash_to_DESTINATION`

```leo
let result: address = BHP256::hash_to_address(1u8);
let result: field = BHP256::hash_to_field(2i64);
let result: group = BHP256::hash_to_group(1field);
let result: scalar = BHP256::hash_to_scalar(1field);
let result: i8 = BHP256::hash_to_i8(1field);
let result: i16 = BHP256::hash_to_i16(1field);
let result: i32 = BHP256::hash_to_i32(1field);
let result: i64 = BHP256::hash_to_i64(1field);
let result: i128 = BHP256::hash_to_i128(1field);
let result: u8 = BHP256::hash_to_u8(1field);
let result: u16 = BHP256::hash_to_u16(1field);
let result: u32 = BHP256::hash_to_u32(1field);
let result: u64 = BHP256::hash_to_u64(1field);
let result: u128 = BHP256::hash_to_u128(1field);
```

#### 説明

`first` を 256 ビットチャンクごとに処理して Bowe-Hopwood-Pedersen ハッシュを計算し、結果を `destination` に格納します。生成されたハッシュは、関数名の `hash_to_DESTINATION` が示すとおり `address` または算術型（`u8`, `u16`, `u32`, `u64`, `u128`, `i8`, `i16`, `i32`, `i64`, `i128`, `field`, `group`, `scalar`）のいずれかになります。

入力が 129 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP512::hash_to_DESTINATION`

```leo
let result: address = BHP512::hash_to_address(1u8);
let result: field = BHP512::hash_to_field(2i64);
let result: group = BHP512::hash_to_group(1field);
let result: scalar = BHP512::hash_to_scalar(1field);
let result: i8 = BHP512::hash_to_i8(1field);
let result: i16 = BHP512::hash_to_i16(1field);
let result: i32 = BHP512::hash_to_i32(1field);
let result: i64 = BHP512::hash_to_i64(1field);
let result: i128 = BHP512::hash_to_i128(1field);
let result: u8 = BHP512::hash_to_u8(1field);
let result: u16 = BHP512::hash_to_u16(1field);
let result: u32 = BHP512::hash_to_u32(1field);
let result: u64 = BHP512::hash_to_u64(1field);
let result: u128 = BHP512::hash_to_u128(1field);
```

#### 説明

`first` を 512 ビットチャンクごとに処理して Bowe-Hopwood-Pedersen ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

入力が 171 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP768::hash_to_DESTINATION`

```leo
let result: address = BHP768::hash_to_address(1u8);
let result: field = BHP768::hash_to_field(2i64);
let result: group = BHP768::hash_to_group(1field);
let result: scalar = BHP768::hash_to_scalar(1field);
let result: i8 = BHP768::hash_to_i8(1field);
let result: i16 = BHP768::hash_to_i16(1field);
let result: i32 = BHP768::hash_to_i32(1field);
let result: i64 = BHP768::hash_to_i64(1field);
let result: i128 = BHP768::hash_to_i128(1field);
let result: u8 = BHP768::hash_to_u8(1field);
let result: u16 = BHP768::hash_to_u16(1field);
let result: u32 = BHP768::hash_to_u32(1field);
let result: u64 = BHP768::hash_to_u64(1field);
let result: u128 = BHP768::hash_to_u128(1field);
```

#### 説明

`first` を 768 ビットチャンクごとに処理して Bowe-Hopwood-Pedersen ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

入力が 129 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `BHP1024::hash_to_DESTINATION`

```leo
let result: address = BHP1024::hash_to_address(1u8);
let result: field = BHP1024::hash_to_field(2i64);
let result: group = BHP1024::hash_to_group(1field);
let result: scalar = BHP1024::hash_to_scalar(1field);
let result: i8 = BHP1024::hash_to_i8(1field);
let result: i16 = BHP1024::hash_to_i16(1field);
let result: i32 = BHP1024::hash_to_i32(1field);
let result: i64 = BHP1024::hash_to_i64(1field);
let result: i128 = BHP1024::hash_to_i128(1field);
let result: u8 = BHP1024::hash_to_u8(1field);
let result: u16 = BHP1024::hash_to_u16(1field);
let result: u32 = BHP1024::hash_to_u32(1field);
let result: u64 = BHP1024::hash_to_u64(1field);
let result: u128 = BHP1024::hash_to_u128(1field);
```

#### 説明

`first` を 1024 ビットチャンクごとに処理して Bowe-Hopwood-Pedersen ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

入力が 171 ビット未満の場合、この命令は停止します。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Keccak256::hash_to_DESTINATION`

```leo
let result: address = Keccak256::hash_to_address(1u8);
let result: field = Keccak256::hash_to_field(2i64);
let result: group = Keccak256::hash_to_group(1field);
let result: scalar = Keccak256::hash_to_scalar(1field);
let result: i8 = Keccak256::hash_to_i8(1field);
let result: i16 = Keccak256::hash_to_i16(1field);
let result: i32 = Keccak256::hash_to_i32(1field);
let result: i64 = Keccak256::hash_to_i64(1field);
let result: i128 = Keccak256::hash_to_i128(1field);
let result: u8 = Keccak256::hash_to_u8(1field);
let result: u16 = Keccak256::hash_to_u16(1field);
let result: u32 = Keccak256::hash_to_u32(1field);
let result: u64 = Keccak256::hash_to_u64(1field);
let result: u128 = Keccak256::hash_to_u128(1field);
```

#### 説明

`first` に対して Keccak256 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Keccak384::hash_to_DESTINATION`

```leo
let result: address = Keccak384::hash_to_address(1u8);
let result: field = Keccak384::hash_to_field(2i64);
let result: group = Keccak384::hash_to_group(1field);
let result: scalar = Keccak384::hash_to_scalar(1field);
let result: i8 = Keccak384::hash_to_i8(1field);
let result: i16 = Keccak384::hash_to_i16(1field);
let result: i32 = Keccak384::hash_to_i32(1field);
let result: i64 = Keccak384::hash_to_i64(1field);
let result: i128 = Keccak384::hash_to_i128(1field);
let result: u8 = Keccak384::hash_to_u8(1field);
let result: u16 = Keccak384::hash_to_u16(1field);
let result: u32 = Keccak384::hash_to_u32(1field);
let result: u64 = Keccak384::hash_to_u64(1field);
let result: u128 = Keccak384::hash_to_u128(1field);
```

#### 説明

`first` に対して Keccak384 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Keccak512::hash_to_DESTINATION`

```leo
let result: address = Keccak512::hash_to_address(1u8);
let result: field = Keccak512::hash_to_field(2i64);
let result: group = Keccak512::hash_to_group(1field);
let result: scalar = Keccak512::hash_to_scalar(1field);
let result: i8 = Keccak512::hash_to_i8(1field);
let result: i16 = Keccak512::hash_to_i16(1field);
let result: i32 = Keccak512::hash_to_i32(1field);
let result: i64 = Keccak512::hash_to_i64(1field);
let result: i128 = Keccak512::hash_to_i128(1field);
let result: u8 = Keccak512::hash_to_u8(1field);
let result: u16 = Keccak512::hash_to_u16(1field);
let result: u32 = Keccak512::hash_to_u32(1field);
let result: u64 = Keccak512::hash_to_u64(1field);
let result: u128 = Keccak512::hash_to_u128(1field);
```

#### 説明

`first` に対して Keccak512 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Pedersen64::hash_to_DESTINATION`

```leo
let result: address = Pedersen64::hash_to_address(1u8);
let result: field = Pedersen64::hash_to_field(2i64);
let result: group = Pedersen64::hash_to_group(1field);
let result: scalar = Pedersen64::hash_to_scalar(1field);
let result: i8 = Pedersen64::hash_to_i8(1field);
let result: i16 = Pedersen64::hash_to_i16(1field);
let result: i32 = Pedersen64::hash_to_i32(1field);
let result: i64 = Pedersen64::hash_to_i64(1field);
let result: i128 = Pedersen64::hash_to_i128(1field);
let result: u8 = Pedersen64::hash_to_u8(1field);
let result: u16 = Pedersen64::hash_to_u16(1field);
let result: u32 = Pedersen64::hash_to_u32(1field);
let result: u64 = Pedersen64::hash_to_u64(1field);
let result: u128 = Pedersen64::hash_to_u128(1field);
```

#### 説明

`first` に対して Pedersen64 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Pedersen128::hash_to_DESTINATION`

```leo
let result: address = Pedersen128::hash_to_address(1u8);
let result: field = Pedersen128::hash_to_field(2i64);
let result: group = Pedersen128::hash_to_group(1field);
let result: scalar = Pedersen128::hash_to_scalar(1field);
let result: i8 = Pedersen128::hash_to_i8(1field);
let result: i16 = Pedersen128::hash_to_i16(1field);
let result: i32 = Pedersen128::hash_to_i32(1field);
let result: i64 = Pedersen128::hash_to_i64(1field);
let result: i128 = Pedersen128::hash_to_i128(1field);
let result: u8 = Pedersen128::hash_to_u8(1field);
let result: u16 = Pedersen128::hash_to_u16(1field);
let result: u32 = Pedersen128::hash_to_u32(1field);
let result: u64 = Pedersen128::hash_to_u64(1field);
let result: u128 = Pedersen128::hash_to_u128(1field);
```

#### 説明

`first` に対して Pedersen128 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Poseidon2::hash_to_DESTINATION`

```leo
let result: address = Poseidon2::hash_to_address(1u8);
let result: field = Poseidon2::hash_to_field(2i64);
let result: group = Poseidon2::hash_to_group(1field);
let result: scalar = Poseidon2::hash_to_scalar(1field);
let result: i8 = Poseidon2::hash_to_i8(1field);
let result: i16 = Poseidon2::hash_to_i16(1field);
let result: i32 = Poseidon2::hash_to_i32(1field);
let result: i64 = Poseidon2::hash_to_i64(1field);
let result: i128 = Poseidon2::hash_to_i128(1field);
let result: u8 = Poseidon2::hash_to_u8(1field);
let result: u16 = Poseidon2::hash_to_u16(1field);
let result: u32 = Poseidon2::hash_to_u32(1field);
let result: u64 = Poseidon2::hash_to_u64(1field);
let result: u128 = Poseidon2::hash_to_u128(1field);
```

#### 説明

`first` に対して入力レート 2 の Poseidon ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Poseidon4::hash_to_DESTINATION`

```leo
let result: address = Poseidon4::hash_to_address(1u8);
let result: field = Poseidon4::hash_to_field(2i64);
let result: group = Poseidon4::hash_to_group(1field);
let result: scalar = Poseidon4::hash_to_scalar(1field);
let result: i8 = Poseidon4::hash_to_i8(1field);
let result: i16 = Poseidon4::hash_to_i16(1field);
let result: i32 = Poseidon4::hash_to_i32(1field);
let result: i64 = Poseidon4::hash_to_i64(1field);
let result: i128 = Poseidon4::hash_to_i128(1field);
let result: u8 = Poseidon4::hash_to_u8(1field);
let result: u16 = Poseidon4::hash_to_u16(1field);
let result: u32 = Poseidon4::hash_to_u32(1field);
let result: u64 = Poseidon4::hash_to_u64(1field);
let result: u128 = Poseidon4::hash_to_u128(1field);
```

#### 説明

`first` に対して入力レート 4 の Poseidon ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `Poseidon8::hash_to_DESTINATION`

```leo
let result: address = Poseidon8::hash_to_address(1u8);
let result: field = Poseidon8::hash_to_field(2i64);
let result: group = Poseidon8::hash_to_group(1field);
let result: scalar = Poseidon8::hash_to_scalar(1field);
let result: i8 = Poseidon8::hash_to_i8(1field);
let result: i16 = Poseidon8::hash_to_i16(1field);
let result: i32 = Poseidon8::hash_to_i32(1field);
let result: i64 = Poseidon8::hash_to_i64(1field);
let result: i128 = Poseidon8::hash_to_i128(1field);
let result: u8 = Poseidon8::hash_to_u8(1field);
let result: u16 = Poseidon8::hash_to_u16(1field);
let result: u32 = Poseidon8::hash_to_u32(1field);
let result: u64 = Poseidon8::hash_to_u64(1field);
let result: u128 = Poseidon8::hash_to_u128(1field);
```

#### 説明

`first` に対して入力レート 8 の Poseidon ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `SHA3_256::hash_to_DESTINATION`

```leo
let result: address = SHA3_256::hash_to_address(1u8);
let result: field = SHA3_256::hash_to_field(2i64);
let result: group = SHA3_256::hash_to_group(1field);
let result: scalar = SHA3_256::hash_to_scalar(1field);
let result: i8 = SHA3_256::hash_to_i8(1field);
let result: i16 = SHA3_256::hash_to_i16(1field);
let result: i32 = SHA3_256::hash_to_i32(1field);
let result: i64 = SHA3_256::hash_to_i64(1field);
let result: i128 = SHA3_256::hash_to_i128(1field);
let result: u8 = SHA3_256::hash_to_u8(1field);
let result: u16 = SHA3_256::hash_to_u16(1field);
let result: u32 = SHA3_256::hash_to_u32(1field);
let result: u64 = SHA3_256::hash_to_u64(1field);
let result: u128 = SHA3_256::hash_to_u128(1field);
```

#### 説明

`first` に対して SHA3_256 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `SHA3_384::hash_to_DESTINATION`

```leo
let result: address = SHA3_384::hash_to_address(1u8);
let result: field = SHA3_384::hash_to_field(2i64);
let result: group = SHA3_384::hash_to_group(1field);
let result: scalar = SHA3_384::hash_to_scalar(1field);
let result: i8 = SHA3_384::hash_to_i8(1field);
let result: i16 = SHA3_384::hash_to_i16(1field);
let result: i32 = SHA3_384::hash_to_i32(1field);
let result: i64 = SHA3_384::hash_to_i64(1field);
let result: i128 = SHA3_384::hash_to_i128(1field);
let result: u8 = SHA3_384::hash_to_u8(1field);
let result: u16 = SHA3_384::hash_to_u16(1field);
let result: u32 = SHA3_384::hash_to_u32(1field);
let result: u64 = SHA3_384::hash_to_u64(1field);
let result: u128 = SHA3_384::hash_to_u128(1field);
```

#### 説明

`first` に対して SHA3_384 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***

### `SHA3_512::hash_to_DESTINATION`

```leo
let result: address = SHA3_512::hash_to_address(1u8);
let result: field = SHA3_512::hash_to_field(2i64);
let result: group = SHA3_512::hash_to_group(1field);
let result: scalar = SHA3_512::hash_to_scalar(1field);
let result: i8 = SHA3_512::hash_to_i8(1field);
let result: i16 = SHA3_512::hash_to_i16(1field);
let result: i32 = SHA3_512::hash_to_i32(1field);
let result: i64 = SHA3_512::hash_to_i64(1field);
let result: i128 = SHA3_512::hash_to_i128(1field);
let result: u8 = SHA3_512::hash_to_u8(1field);
let result: u16 = SHA3_512::hash_to_u16(1field);
let result: u32 = SHA3_512::hash_to_u32(1field);
let result: u64 = SHA3_512::hash_to_u64(1field);
let result: u128 = SHA3_512::hash_to_u128(1field);
```

#### 説明

`first` に対して SHA3_512 ハッシュを計算し、結果を `destination` に格納します。生成されるハッシュは `hash_to_DESTINATION` が示すとおり、`address` または算術型のいずれかです。

#### 対応している型

| 第 1 引数     | 出力先                                                                                               |
|-----------|:----------------------------------------------------------------------------------------------------------|
| `address` | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `bool`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `field`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `group`   | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `i128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u8`      | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u16`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u32`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u64`     | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `u128`    | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `scalar`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |
| `struct`  | `address`, `field`, `group`, `scalar`, `i8`, `i16`, `i32`,`i64`,`i128`, `u8`, `u16`, `u32`, `u64`, `u128` |

[トップに戻る](#table-of-standard-operators)
***
