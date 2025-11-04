---
id: overview
title: Leo 言語リファレンス
sidebar_label: 概要
slug: /overview
---
[general tags]: # (syntax)

### 静的型付け

Leo は **静的型付け言語** です。つまり、回路を実行する前に各変数の型が分かっていなければなりません。

Leo では `undefined` や `null` といった値は利用できません。新しい変数を宣言するときは、型を次のいずれかの方法で決定する必要があります。

- 型注釈を用いて**明示的に指定する**
- コンパイラによる**自動推論に任せる**


<!-- The exception to this rule is when a new variable inherits its type from a previous variable. -->

### 値渡し

Leo の式は常に **値渡し** で扱われます。関数の引数や代入式の右辺で利用される際、値は必ずコピーされます。
