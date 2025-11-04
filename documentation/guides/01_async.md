---
id: async
title: 非同期プログラミングモデル
sidebar_label: 非同期モデル
---
[general tags]: # (guides, async, async_transition, async_function, future, program)

## 背景

Leo の非同期プログラミングモデルは、開発者にとって扱いやすい構文でオンチェーンの公開データを更新できるようにします。オンチェーンのコードを呼び出すときは、`Future` オブジェクトを返す非同期関数呼び出しとして扱われます。`Future` には関数名と引数として渡された値が記録され、どの関数を実行したいかを表現します。トランザクションに付随する証明がバリデータによって検証されたのちに、オンチェーンの状態変更が実際に反映されます。


## 公開状態の管理

オンチェーンのデータは公開マッピングに保存されます。マッピングを読み書きするロジックは、必ず次のように `async function` ブロックの内部に含める必要があります。

```leo
program first_mapping.aleo {
    mapping accumulator: u8 => u64;

    async function finalize_increment_state(){
        let current_count: u64 = accumulator.get_or_use(0u8, 0u64); // Get current value, default 0
        let new_count: u64 = current_count + 1u64;
        accumulator.set(0u8, new_count);
    }
}
```

ただし、ユーザーが直接呼び出せるのは `transition` 関数だけです。`async function` によって生成された Future を有効に活用するには、`transition` 関数から返す必要があります。ブロック内で `async function` を呼び出す `transition` の場合、`async` キーワードで注釈を付け、戻り値として明示的に `Future` を返さなければなりません。非同期トランジションではレコードなど他のデータ型をタプルで一緒に返すこともできますが、`Future` は 1 つだけで、タプルの最後に置く必要があります。
```leo
program first_mapping.aleo {
    mapping accumulator: u8 => u64;
    
    async transition_increment() -> Future {
        return finalize_increment_state();
    }

    async function finalize_increment_state(){
        let current_count: u64 = accumulator.get_or_use(0u8, 0u64); // Get current value, default 0
        let new_count: u64 = current_count + 1u64;
        accumulator.set(0u8, new_count);
    }
}
```

Leo には、`async transition` 関数内で `async` ブロックを使うことでオンチェーンコードを簡潔に記述するためのショートハンド構文も用意されています。
```leo
program first_mapping.aleo {
    mapping accumulator: u8 => u64;
    
    async transition_increment() -> Future {
        let f : Future = async {
            let current_count: u64 = accumulator.get_or_use(0u8, 0u64); // Get current value, default 0
            let new_count: u64 = current_count + 1u64;
            accumulator.set(0u8, new_count);
        }
        return f;
    }

}
```



## 外部プログラムから非同期トランジションを呼び出す

Leo では、インポートしたプログラムの `async transition` を自分の `async transition` 内から呼び出すことができます。非同期トランジションを呼び出すと `Future` が返されるため、その `Future` を非同期関数の入力として渡します。戻ってきた `Future` は、以下の例のように `async function` の内部で `await` キーワードを使って連携させます。

```leo
import first_mapping.aleo;

program second_mapping.aleo {
    mapping hashes: u8 => scalar;

    async transition two_mappings(value: u8) -> Future {
        let increment_future: Future = first_mapping.aleo/transition_increment();
        return finalize_update_mapping(value, imported_future); 
    } 

    async function finalize_update_mapping(value: u8, imported_future: Future) {
	    imported_future.await();
	    let hash: scalar = BHP256::hash_to_scalar(value);
        hashes.set(value, hash);
    }
}
```

`async` ブロックを利用する場合は、ブロックの外で外部 `async transition` を呼び出し、内部で `await` する必要があります。
```leo
import first_mapping.aleo;

program second_mapping.aleo {
    mapping hashes: u8 => scalar;

    async transition two_mappings(value: u8) -> Future {
        let increment_future: Future = first_mapping.aleo/transition_increment();
        let f: Future = async {
            imported_future.await();
            let hash: scalar = BHP256::hash_to_scalar(value);
            hashes.set(value, hash);
        }
        return f; 
    } 
}
```


## 非同期トランジションにおける公開状態とプライベート状態

Aleo では、プライベート状態の更新にオフチェーンでの証明生成を利用し、ユーザーのデータやアドレスの機密性を守ります。そのため `async function` のスコープ内でレコードを生成・消費することはできません。一方、`async transition` のスコープ内ではレコードを扱うことができます。トランジション（および非同期トランジション）関数は最初にオフチェーンで実行され、正しく実行されたことを示す証明と共にバリデータに送られます。証明が検証されると、バリデータは `Future` に格納されたコード（`async function` 内で定義された処理）を実行します。

|                          | **公開状態**           | **プライベート状態**                    |
|--------------------------|------------------------|----------------------------------------|
| **関数の種類**           | `async function`       | `async transition` または `transition` |
| **データの保存先**       | `mapping`              | `record`                               |
| **可視性**               | 誰でも参照可能         | `viewkey` を持つ人のみ参照可能         |
