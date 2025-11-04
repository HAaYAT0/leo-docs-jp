---
id: cli_test
title: ""
sidebar_label: Test
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_test, testing)

# `leo test`

このコマンドは `tests/` ディレクトリ内に定義されたすべてのテストケースを実行します。

特定のテストだけを実行したい場合は次を利用します。
```bash
leo test <TEST_NAME>
```
`<TEST_NAME>` はテストの完全修飾名に対してマッチングを行う文字列です。

詳しくは [**Testing**](./../guides/08_testing.md) を参照してください。


### Flags:
```
--offline
    Enables offline mode.
--enable-ast-spans
    Enable spans in AST snapshots.
--enable-dce
    Enables dead code elimination in the compiler.
--conditional-block-max-depth <CONDITIONAL_BLOCK_MAX_DEPTH>
    Max depth to type check nested conditionals. [default: 10]
--disable-conditional-branch-type-checking
    Disable type checking of nested conditional branches in finalize scope.
--enable-initial-ast-snapshot
    Write an AST snapshot immediately after parsing.
--enable-all-ast-snapshots
    Writes all AST snapshots for the different compiler phases.
--ast-snapshots <AST_SNAPSHOTS>...
    Comma separated list of passes whose AST snapshots to capture.
--build-tests
    Build tests along with the main program and dependencies.
--no-cache
    Don't use the dependency cache.
--no-local
    Don't use the local source code.
```
