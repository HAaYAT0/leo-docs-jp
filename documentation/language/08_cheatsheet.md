---
id: cheatsheet
title: Leo 構文チートシート
sidebar: チートシート
---
[general tags]: # (program, import, boolean, integer, field, group, scalar, address, signature, array, tuple, struct, operators, cryptographic_operators, assert, hash, commit, random, address, block, transition, async_transition, function, async_function, inline, mapping, conditionals, loops)

## 1. ファイルのインポート
```leo
import foo.aleo;
```

## 2. プログラム
```leo
program hello.aleo {
    // code
}
```

## 3. 基本データ型
```leo
// ブール値（true または false）
let b: bool = false; 

// 符号付き 32 ビット整数（他に i8, i16, i64, i128 など）
let i: i32 = -10i32; 

// 符号なし 32 ビット整数（他に u8, u16, u64, u128 など）
let ui: u32 = 10u32; 

// フィールド要素（暗号計算で使用）
let a: field = 1field; 

// グループ要素（楕円曲線演算で使用）
let g: group = 0group; 

// スカラー要素（楕円曲線演算で使用）
let s: scalar = 1scalar; 

// Aleo ブロックチェーンアドレス
let receiver: address = aleo1ezamst4pjgj9zfxqq0fwfj8a4cjuqndmasgata3hggzqygggnyfq6kmyd4; 

// デジタル署名（認証・検証に利用）
let s: signature = sign1ftal5ngunk4lv9hfygl45z35vqu9cufqlecumke9jety3w2s6vqtjj4hmjulh899zqsxfxk9wm8q40w9zd9v63sqevkz8zaddugwwq35q8nghcp83tgntvyuqgk8yh0temt6gdqpleee0nwnccxfzes6pawcdwyk4f70n9ecmz6675kvrfsruehe27ppdsxrp2jnvcmy2wws6sw0egv;
```

### 型キャスト
```leo
// 整数型同士のキャスト
let a: u8 = 255u8;
let b: u16 = a as u16; // 255u8 → 255u16
let c: u32 = b as u32; // 255u16 → 255u32
let d: i32 = c as i32; // 255u32 → 255i32

// field と整数のキャスト
let f: field = 10field;
let i: i32 = f as i32; // field を i32 へ
let u: u64 = f as u64; // field を u64 へ

// scalar と field のキャスト
let s: scalar = 5scalar;
let f_from_scalar: field = s as field; // scalar を field へ

// group と field のキャスト
let g: group = 1group;
let f_from_group: field = g as field; // group を field へ

// アドレスのキャスト（可能な変換のみ）
let addr: address = aleo1ezamst4pjgj9zfxqq0fwfj8a4cjuqndmasgata3hggzqygggnyfq6kmyd4;
let addr_field: field = addr as field; // address を field へ
```
プリミティブ型は `address`, `bool`, `field`, `group`, `i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `scalar` です。  
`signature` へのキャストはできません。  
`address` から `field` へのキャストは可能ですが、その逆はできません。

## 4. レコード
レコードの定義
```leo
record Token {
    owner: address,
    amount: u64,
}
```

レコードの生成
```leo
let user: User = User {
    owner: aleo1ezamst4pjgj9zfxqq0fwfj8a4cjuqndmasgata3hggzqygggnyfq6kmyd4,
    balance: 1000u64,
};
```

レコードのフィールド参照
```leo
let user_address: address = user.owner;
let user_balance: u64 = user.balance;
```

## 5. 構造体
構造体の定義
```leo
struct Message {
    sender: address,
    object: u64,
};
```

構造体の生成
```leo
let msg: Message = Message {
    sender: aleo1ezamst4pjgj9zfxqq0fwfj8a4cjuqndmasgata3hggzqygggnyfq6kmyd4,
    object: 42u64,
};
```

構造体のフィールド参照
```leo
let sender_address: address = msg.sender;
let object_value: u64 = msg.object;
```

## 6. 配列
配列の宣言
```leo
let arrb: [bool; 2] = [true, false];
let arr: [u8; 4] = [1u8, 2u8, 3u8, 4u8]; 
```
**配列は空にできません。**

要素の取得
```leo
let first: u8 = arr[0]; // 先頭要素
let second: u8 = arr[1]; // 2 つ目の要素
```

要素の変更  
Leo では変数が不変のため、配列も宣言後に変更できません。

配列の走査
```leo
let numbers: [u32; 3] = [5u32, 10u32, 15u32];

let sum: u32 = 0u32;

for i: u8 in 0u8..3u8 {
    sum += numbers[i];
}
```

## 7. タプル
タプルの宣言
```leo
let t: (u8, bool, field) = (42u8, true, 100field);
```
**配列と同様、タプルも空にしたり変更したりできません。**

タプルのアクセス

分割代入
```leo
let (a, b, c) = t; 
```

インデックスによるアクセス
```leo
let first: u8 = t.0;
let second: bool = t.1;
let third: field = t.2;
```

## 8. トランジション
```leo
transition mint_public(
    public receiver: address,
    public amount: u64,
) -> Token { /* ここに処理を記述 */ }
```

## 9. 各種関数
Leo では次の 3 種類の関数があります。
1. **transition**: `function` と `inline` を呼び出せます。
2. **function**: `inline` だけを呼び出せます。
3. **inline**: 他の `inline` のみ呼び出せます。

**直接・間接を問わず再帰呼び出しは不可です。**

### 内部関数
`function` は計算のための関数で、状態を変更できず、`inline` のみ呼び出せます。
```leo
function compute(a: u64, b: u64) -> u64 {
    return a + b;
}
```
✅ 呼び出せる: `inline`  
❌ 呼び出せない: `function` / `transition`

### インライン関数
`inline` 関数は小さな処理向けで、コンパイル時に展開されます。
```leo
inline foo(
    a: field,
    b: field,
) -> field {
    return a + b;
}
```
✅ 呼び出せる: `inline`  
❌ 呼び出せない: `function` / `transition`

### トランジション関数
`transition` は状態変更のための関数で、`function` と `inline` を呼び出せますが、他の `transition` から呼び出すことはできません。
```leo
transition transfer(receiver: address, amount: u64) {
    let balance: u64 = 1000u64; // 例としての残高
    let new_balance: u64 = subtract(balance, amount);
    // 実際に送金するロジックをここに記述
}

function subtract(a: u64, b: u64) -> u64 {
    return a - b;
}
```
✅ 呼び出せる: `function`, `inline`  
❌ 呼び出せない: 他の `transition`

## 10. for ループ
```leo
let count: u32 = 0u32;

for i: u32 in 0u32..5u32 {
    count += 1u32;
}
```

## 11. マッピング
```leo
mapping balances: address => u64;

let contains_bal: bool = Mapping::contains(balances, receiver);
let get_bal: u64 = Mapping::get(balances, receiver);
let get_or_use_bal: u64 = Mapping::get_or_use(balances, receiver, 0u64);
let set_bal: () = Mapping::set(balances, receiver, 100u64);
let remove_bal: () = Mapping::remove(balances, receiver);
```

## 12. コマンド例
```leo
transition matches(height: u32) -> Future {
    return check_height_matches(height);
}
async function check_height_matches(height: u32) {
    assert_eq(height, block.height); // 最新ブロック高を返す
}

let g: group = group::GEN; // グループの生成元
let result: u32 = ChaCha::rand_u32(); // ChaCha による乱数生成
let owner: address = self.caller; // トランジション呼び出し元のアドレス
let hash: field = BHP256::hash_to_field(1u32); // 任意の型を任意の型へハッシュ
let commit: group = Pedersen64::commit_to_group(1u64, 1scalar); // Pedersen コミット

let a: bool = true;
assert(a); // `a` が true であることを確認

let a: u8 = 1u8;
let b: u8 = 2u8;
assert_eq(a, a); // a と a の等価性
assert_neq(a, b); // a と b の非等価性
```


## 13. 演算子
```leo
let sum: u64 = a + b; // 加算
let diff: u64 = a - b; // 減算
let prod: u64 = a * b; // 乗算
let quot: u64 = a / b; // 除算
let remainder: u64 = a % b; // 剰余
let neg: u64 = -a; // 符号反転
let bitwise_and: u64 = a & b; // ビット AND
let bitwise_or: u64 = a | b; // ビット OR
let bitwise_xor: u64 = a ^ b; // ビット XOR
let bitwise_not: u64 = !a; // ビット NOT
let logical_and: bool = a && b; // 論理 AND
let logical_or: bool = a || b; // 論理 OR
let eq: bool = a == b; // 等価比較
let neq: bool = a != b; // 非等価比較
let lt: bool = a < b; // より小さい
let lte: bool = a <= b; // 以下
let gt: bool = a > b; // より大きい
let gte: bool = a >= b; // 以上
```
