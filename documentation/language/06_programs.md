---
id: programs
title: 実践でのプログラム活用
sidebar_label: 実践でのプログラム
---
[general tags]: # (program, mapping, transition, function, inline, async_transition, async_function)

## マッピング {#mappings}

### マッピング操作 {#mapping-operations}

マッピングに対する読み書きは、以下の関数を呼び出すことで行います。

#### get

`current_value = Mapping::get(counter, addr);` のように `get` を呼び出すと、`counter` 内のキー `addr` に対応する値を `current_value` に読み込みます。  
もし `addr` に対応する値が存在しなければ、プログラムは失敗します。

#### get_or_use

キーが存在しない場合に既定値を利用する `get` です。  
例: `let current_value: u64 = Mapping::get_or_use(counter, addr, 0u64);`  
`addr` に結び付いた値を `counter` から読み込み `current_value` に格納します。存在しない場合は `0u64` が `counter` と `current_value` の両方に設定されます。

#### set

`Mapping::set(counter, addr, current_value + 1u64);` のように `set` を呼び出すと、`counter` のキー `addr` に `current_value + 1u64` を保存します。

#### contains

`let contains: bool = Mapping::contains(counter, addr);` とすると、`addr` が `counter` に存在するかどうかを真偽値で返します。

#### remove

`Mapping::remove(counter, addr);` で、`counter` からキー `addr` のエントリを削除します。

#### 利用時の注意

:::info
マッピング操作は [非同期関数](#async-function) 内でのみ使用できます。
:::

```leo showLineNumbers
program test.aleo {
    mapping counter: address => u64;

    async transition dubble() -> Future {
        return update_mappings(self.caller);
    }

    async function update_mappings(addr: address) {
        let current_value: u64 = Mapping::get_or_use(counter, addr, 0u64);
        Mapping::set(counter, addr, current_value + 1u64);
        current_value = Mapping::get(counter, addr);
        Mapping::set(counter, addr, current_value + 1u64);
    }

}
```

### Future {#future}

`Future` は非同期処理の完了時にオンチェーンで実行されるコードブロックを表す型です。`async transition` や `async function` から返され、トランジションの証明が検証された後に順次処理されます。マッピングの更新やイベント発行など、チェーン上の状態を書き換える操作をまとめて遅延実行する際に利用します。

## 関数 {#functions}

### トランジション関数 {#transition-function}

Leo のトランジション関数は `transition {name}() {}` の形式で宣言します。`leo run` で実行するときに直接呼び出せます。  
トランジション関数は値を計算する式や文を含み、呼び出すには同じプログラムスコープ内に存在している必要があります。  
オンチェーンで実行する [非同期関数](#async-function) を呼び出すトランジションは `async transition` として宣言しなければなりません。

```leo showLineNumbers
program hello.aleo {
    transition foo(
        public a: field,
        b: field,
    ) -> field {
        return a + b;
    }
}
```

#### 関数の引数

関数引数は `{visibility} {name}: {type}` の形式で指定し、関数名の直後の括弧内に並べます。

```leo showLineNumbers
// トランジション関数 `foo` は可視性 `public`、型 `field` の引数 `a` を 1 つ受け取る。
transition foo(public a: field) { }
```

#### 関数の戻り値

戻り値は `return {expression};` で指定します。`return` を実行すると関数の処理は終了します。  
宣言した戻り値の型と `expression` の型は一致している必要があります。

```leo showLineNumbers
transition foo(public a: field) -> field {
    // 公開入力 a に 1field を足した結果を返す。
    return a + 1field;
}
```

### ヘルパー関数 {#helper-function}

ヘルパー関数は `function {name}({arguments}) {}` で宣言します。値を計算する式や文を含みますが、`record` を生成することはできません。

ヘルパー関数は直接呼び出せず、他の関数から利用します。トランジション関数と異なり `{visibility}` 修飾子は使えません。外部インターフェースではなく内部処理専用だからです。

```leo showLineNumbers
function foo(
    a: field,
    b: field,
) -> field {
    return a + b;
}
```

### インライン関数 {#inline-function}

インライン関数は `inline {name}() {}` で宣言します。処理本体はコンパイル時に各呼び出し箇所へインライン展開されるため、外部から直接実行することはできません。

ヘルパー関数と同様に可視性修飾子は使用できません。

```leo showLineNumbers
inline foo(
    a: field,
    b: field,
) -> field {
    return a + b;
}
```

Leo v3.0.0 以降ではインライン関数でも **const generics** を利用できます。
```leo showLineNumbers
inline sum_first_n_ints::[N: u32]() -> u32 {
    let sum = 0u32;
    for i in 0u32..N {
        sum += i
    }
    return sum;
}
 
transition main() -> u32 {
    return sum_first_n_ints::[5u32]();
}
```
const ジェネリックに指定できる型は整数型・`bool`・`scalar`・`group`・`field`・`address` です。


### 非同期関数 {#async-function}

非同期関数はオンチェーンで実行する処理を記述するためのものです。`async function` として宣言し、呼び出すと [`Future`](#future) オブジェクトを返します。ゼロ知識証明付きで後から実行されるため「非同期」と呼ばれます。公共のマッピングを更新する場合などに用いられます。  
非同期関数を呼び出せるのは [`async transition`](#transition-function) のみで、対応するトランジションの証明が検証された後にオンチェーンで実行されます。

非同期関数はアトミックであり、失敗した場合は状態が元に戻されます。

以下は `transfer_public_to_private` トランジション内で非同期関数を使ってマッピングを更新する例です。

```leo showLineNumbers
program transfer.aleo {
    // `transfer_public_to_private` は指定した量のトークンを
    // 公開マッピング `account` から受領者のトークンレコードへ変換する。
    //
    // 受領者のレコードは秘匿されるが、送信者と数量は公開される点に注意。
    async transition transfer_public_to_private(
        receiver: address,
        public amount: u64
    ) -> (token, Future) {
        // 受領者のトークンレコードを生成。
        let new: token = token {
            owner: receiver,
            amount,
        };

        // レコードを返し、あわせて公開マッピング上の残高を減らす。
        return (new, update_public_state(self.caller, amount));
    }

    async function update_public_state(
        public sender: address,
        public amount: u64
    ) {
        // account[sender] から amount を減算。
        // エントリが無ければ作成される。減算でアンダーフローするとトランジション全体が巻き戻される。
        let current_amount: u64 = Mapping::get_or_use(account, sender, 0u64);
        Mapping::set(account, sender, current_amount - amount);
    }
}
```

同様の処理を `async transition` 内の `async` ブロックで記述することもできます。

```leo showLineNumbers
program transfer.aleo {
    async transition transfer_public_to_private(
        receiver: address,
        public amount: u64
    ) -> (token, Future) {
        let new: token = token {
            owner: receiver,
            amount,
        };

        let f : Future = async {
            let current_amount: u64 = Mapping::get_or_use(account, self.caller, 0u64);
            Mapping::set(account, self.caller, current_amount - amount);
        }

        return (new, f);
    }
}
```

公開状態を操作する必要がない場合、非同期関数を使う必要はありません。

### 関数呼び出しのルール {#function-call-rules}

- 利用できる関数の種類は `transition`・`function`・`inline` の 3 種類です。
- `transition` からは `function`・`inline`・外部の `transition` を呼び出せます。
- `function` から呼び出せるのは `inline` のみです。
- `inline` から呼び出せるのは他の `inline` のみです。
- 直接・間接を問わず再帰呼び出しはできません。

## 制約事項 {#limitations}

snarkVM では Aleo プログラムに以下の制限があります。
- プログラムの最大サイズ: 文字数で 100 KB
- マッピングの最大数: 31
- インポートの最大数: 64
- インポートの最大深度: 64
- 呼び出しスタックの最大深さ: 31
- 関数の最大数: 31
- 構造体の最大数: 310
- レコードの最大数: 310
- クロージャの最大数: 62

**コンパイル後の Leo プログラムがこれらの制限を超える場合は、モジュール化や設計の見直しを検討してください。** 制限の引き上げは、Aleo Network Foundation が定めるガバナンス手続きを経たプロトコルアップグレードによってのみ可能です。

その他のプロトコルレベルの制限は以下のとおりです。
- **トランザクションサイズの上限は 128 KB** です。入力や出力が大きすぎる場合は、Leo コードで利用するデータ型を最適化してください。
- **オンチェーン実行に使用できる手数料の上限は `100_000_000` マイクロクレジット** です。これを超える場合は、オンチェーン部分のロジックを見直してください。

これらの制限についても、引き上げにはガバナンスプロセスが必要です。

## 条件付きオンチェーンコードのコンパイル {#compiling-conditional-on-chain-code}

次のトランジションを考えます。
```leo showLineNumbers
transition weird_sub(a: u8, b: u8) -> u8 {
    if (a >= b) {
        return a.sub_wrapped(b);
    } else {
        return b.sub_wrapped(a);
    }
}
```
これは以下の Aleo 命令にコンパイルされます。
```aleo showLineNumbers
function weird_sub:
    input r0 as u8.private;
    input r1 as u8.private;
    gte r0 r1 into r2;
    sub.w r0 r1 into r3;
    sub.w r1 r0 into r4;
    ternary r2 r3 r4 into r5;
    output r5 as u8.private;
```
この例では、条件分岐の両方の分岐が実行され、`ternary` 命令で最終的な出力が選択されています。トランジション内の演算は純粋関数的であるため、このようなコンパイルが可能になっています。[^1]

一方、オンチェーン命令はすべてが純粋関数的ではありません。たとえば `get`・`get_or_use`・`contains`・`remove`・`set` などはプログラムの状態に依存するため、同様のテクニックを使うことはできません。  
その代わりに `branch` と `position` 命令を用いて、特定のコードブロックをスキップできるようにコンパイルされます。ただしスキップされた命令の出力レジスタは初期化されないため、後続の命令で参照するとエラーになります。すなわち、分岐によっては未定義のレジスタが存在し、それにアクセスすると実行エラーが発生します。  
Leo のコードでこの状況が発生するのは、条件分岐内から親スコープの変数へ代入しようとする場合です。そのためこのようなパターンはコンパイル時に禁止されています。

この制約は将来的な `snarkVM` の改善で緩和される可能性がありますが、現時点では上記の制約がある点に注意してください。

[^1]: `add` のようにオーバーフローで失敗する演算など、一部の操作は完全な純粋関数ではありません。
