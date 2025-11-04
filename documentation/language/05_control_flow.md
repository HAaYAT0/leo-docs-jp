---
id: control 
title: 制御フロー
sidebar_label: 制御フロー
---
[general tags]: # (loop, conditional, return)

### 条件分岐 {#conditional-statements}

条件分岐は `if {condition} { ... } else if {condition} { ... } else { ... }` の形で記述します。入れ子にすることも可能です。
```leo
let a: u8 = 1u8;
    
if a == 1u8 {
    a += 1u8;
} else if a == 2u8 {
    a += 2u8;
} else {
    a += 3u8;
}
```

Leo では 3 項演算子もサポートされています。`{condition} ? {then} : {else}` という書式で、こちらも入れ子にできます。
```leo
let a: u8 = 1u8;    
a = (a == 1u8) ? a + 1u8 : ((a == 2u8) ? a + 2u8 : a + 3u8);
```

### return 文 {#return-statements}

`return {expression};` の形式で記述します。

```leo
let a: u8 = 1u8;
    
if a == 1u8 {
    return a + 1u8;
} else if a == 2u8 {
    return a + 2u8;
} else {
    return a + 3u8;
}
```


### for ループ {#for-loops}

for ループは `for {variable: type} in {下限}..{上限}` という書式です。上下限には同じ整数型の定数を指定する必要があり、かつ下限は上限より小さくなければなりません。入れ子のループも利用できます。

```leo
let count: u32 = 0u32;

for i: u32 in 0u32..5u32 {
    count += 1u32;
}

return count; // 5u32 を返す
```
