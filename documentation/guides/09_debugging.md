---
id: debuggin
title: Debuggin' Out 
sidebar_label: デバッグ
---
[general tags]: # (guides, debug, debugger, program)

`leo debug` はインタラクティブに実行を追いかけ、バグの原因を突き止められる強力なツールです。このワークショップでは Leo デバッガーを使って様々なプログラムを観察し、デバッグのコツを身に付けます。

**このチュートリアルは Leo の基礎知識があることを前提としています。**

# セットアップ

## ソースコード

[workshop リポジトリ](https://github.com/ProvableHQ/workshop/tree/master/debuggin-out) から最新版を取得します。

## Leo のインストール

[Leo のビルドガイド](https://github.com/ProvableHQ/leo?tab=readme-ov-file#%EF%B8%8F%EF%B8%8F-build-guide) に従ってインストールしてください。ワークショップに同梱されている [install.sh](https://github.com/ProvableHQ/workshop/blob/master/install.sh) スクリプトを利用しても構いません。

# はじめに

まずはデバッガーを起動してみましょう。
```bash
leo debug
```
すると次のようなプロンプトが表示されます。
<pre>
<code>
This is the Leo Interpreter. Try the command `#help`.
? <b>Command?</b> › 
</code>
</pre>
`#help` コマンドを入力して、利用可能なサブコマンドを確認します。
<pre>
<code>
✔ <b>Command?</b> · #help

You probably want to start by running a function or transition.
For instance
#into program.aleo/main()
Once a function is running, commands include
#into    to evaluate into the next expression or statement;
#step    to take one step towards evaluating the current expression or statement;
#over    to complete evaluating the current expression or statement;
#run     to finish evaluating
#quit    to quit the interpreter.

You can set a breakpoint with
#break program_name line_number

When executing Aleo VM code, you can print the value of a register like this:
#print 2

Some of the commands may be run with one letter abbreviations, such as #i.

Note that this interpreter is not line oriented as in many common debuggers;
rather it is oriented around expressions and statements.
As you step into code, individual expressions or statements will
be evaluated one by one, including arguments of function calls.

You may simply enter Leo expressions or statements on the command line
to evaluate. For instance, if you want to see the value of a variable w:
w
If you want to set w to a new value:
w = z + 2u8;

Note that statements (like the assignment above) must end with a semicolon.

If there are futures available to be executed, they will be listed by
numerical index, and you may run them using `#future` (or `#f`); for instance
#future 0

The interpreter begins in a global context, not in any Leo program. You can set
the current program with

#set_program program_name

This allows you to refer to structs and other items in the indicated program.

The interpreter may enter an invalid state, often due to Leo code entered at the
REPL. In this case, you may use the command

#restore

Which will restore to the last saved state of the interpreter. Any time you
enter Leo code at the prompt, interpreter state is saved.

Input history is available - use the up and down arrow keys.
</code>
</pre>

`leo debug` は対話型の REPL を初期化し、任意の Leo コードをその場で実行できます。

<pre>
<code>
✔ <b>Command?</b> · 1u32 + 2u32
Result: 3u32

✔ <b>Command?</b> · let x: u32 = 1u32;
✔ <b>Command?</b> · let y: u32 = 2u32;
✔ <b>Command?</b> · let z: u32 = x + y;
✔ <b>Command?</b> · x
Result: 1u32

✔ <b>Command?</b> · y
Result: 2u32

✔ <b>Command?</b> · z
Result: 3u32
</code>
</pre>

しかし多くの場合、特定のプログラムをステップ実行して挙動を確認する目的で利用します。

ワークショップのソースをダウンロードしたディレクトリで、次のように移動してデバッガーを起動します。
```bash
cd workshop/learn_to_debug/point_math
leo debug
```
デバッガーは `point_math.aleo` を型チェックし、プログラム定義へアクセスした状態で REPL を初期化します。コマンドを使って任意のタイミングで実行を制御できます。

- `#into` / `#i` — 次の式または文の内部へ入ります
- `#step` / `#s` — 現在の式または文の評価を 1 ステップ進めます
- `#over` / `#o` — 現在の式または文を最後まで評価します
- `#run` / `#r` — 残りを一気に評価します
- `#break` / `#b <PROGRAM_NAME> <LINE_NUMBER>` — ブレークポイントを設定します
- `#watch` / `#w <EXPRESSION>` — 指定した式の値をウォッチし、各ステップで表示します

特に `#into` は、式や文の前に付けて入力するとその処理へ潜り込みながらデバッグできるため便利です。ここでは `sqrt_bitwise` 関数の評価をステップ実行してみましょう。

<pre>
<code>
✔ <b>Command?</b> · #i point_math.aleo/sqrt_bitwise(0u32)
Prepared to evaluate:
<b>point_math.aleo/sqrt_bitwise(0u32)</b>

✔ <b>Command?</b> · #i
Prepared to evaluate:
point_math.aleo/sqrt_bitwise(<b>0u32</b>)

✔ <b>Command?</b> · #s
Result: 0u32

Prepared to evaluate:
<b>point_math.aleo/sqrt_bitwise(0u32)</b>

✔ <b>Command?</b> · #s
Prepared to evaluate:
<b>point_math.aleo/sqrt_bitwise(0u32)</b>

✔ <b>Command?</b> · #s
Result: 0u32
</code>
</pre>


## チャレンジ

1. 上記コマンドを使い、`sqrt_bitwise` を `0u32`、`1u32`、`4u32`、`9u32` の入力で実行して結果を確認してください。
2. デバッガーを使用し、次の操作を行ってください。
   a. 異なる値を持つ `Point` レコードを 2 つ作成し保存する。  
   b. 2 点間の距離を計算する。  
   c. 2 点を加算する。

## 解答例

チャレンジの手順を記録したトランスクリプトを以下に載せます。必要に応じて参照してください。

### パート 1（抜粋）
<pre>
<code>
✔ <b>Command?</b> · #i point_math.aleo/sqrt_bitwise(0u32)
Prepared to evaluate:
point_math.aleo/sqrt_bitwise(0u32)

✔ <b>Command?</b> · #o
Result: 0u32
</code>
</pre>

実行時に困った場合は、`#help` が表示するチートシートを活用してください。

```
You probably want to start by running a function or transition.
For instance
#into program.aleo/main()
Once a function is running, commands include
#into    to evaluate into the next expression or statement;
#step    to take one step towards evaluating the current expression or statement;
#over    to complete evaluating the current expression or statement;
#run     to finish evaluating
#quit    to quit the interpreter.

You can set a breakpoint with
#break program_name line_number

When executing Aleo VM code, you can print the value of a register like this:
#print 2
```
