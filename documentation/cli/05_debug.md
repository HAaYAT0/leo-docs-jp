---
id: cli_debug
title: ""
sidebar_label: Debug
---
[general tags]: # (cli, leo_debug, debug, debugger)

# `leo debug`

Leo プロジェクトで対話型デバッガーを起動するには `leo debug` を実行します。

```bash
> leo debug
       Leo ✅ Compiled sources for 'workshop'
This is the Leo Interpreter. Try the command `#help`.

? Command? › 
```

### チートシート

<!--TODO: Rewrite this cheatsheet to present the information in a more condensed form.-->

```
まずは関数または transition を実行するところから始めましょう。
例:
#into program.aleo/main()

関数を実行中に利用できる主なコマンドは以下のとおりです。
#into    次の式や文に入ります
#step    現在の式や文を 1 ステップだけ進めます
#over    現在の式や文の評価を完了させます
#run     評価を最後まで進めます
#quit    インタープリタを終了します

ブレークポイントは次のように設定します。
#break program_name line_number

Aleo VM のコードを実行しているとき、レジスタの値を表示するには:
#print 2

多くのコマンドは 1 文字の省略形でも実行できます。例: #i

このインタープリタは行単位ではなく、式と文の単位で動作します。
コードをステップ実行すると、関数呼び出しの引数も含めて、個々の式や文が順番に評価されます。

コマンドラインで Leo の式や文をそのまま入力して評価できます。
例として、変数 w の値を確認したい場合:
w
値を更新したい場合:
w = z + 2u8;

代入のような文は必ずセミコロンで終える必要があります。

実行可能な future がある場合は番号付きで表示され、`#future`（または `#f`）で実行できます。
例:
#future 0

インタープリタはグローバルコンテキストで開始され、Leo プログラム内ではありません。
現在のプログラムを指定するには:
#set_program program_name

これにより、指定したプログラム内の構造体などを参照できます。

インタープリタが不正な状態に陥ることがあります（主に REPL で入力した Leo コードが原因です）。
その場合は次のコマンドで最後に保存された状態に戻せます。
#restore

プロンプトで Leo コードを実行するたびに、インタープリタの状態は自動的に保存されます。

入力履歴も利用可能です。上下の矢印キーで辿れます。
```

詳細は [Debugging](./../guides/09_debugging.md) を参照してください。
