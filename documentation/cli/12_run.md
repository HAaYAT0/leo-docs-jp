---
id: cli_run
title: ""
sidebar_label: Run
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_run, run, transition, async_transition)

# `leo run`

`leo run` は `transition` または `async transition` 関数を実行し、指定した入力に対してどのような出力が得られるかを確認するためのコマンドです。ゼロ知識証明やトランザクションは生成されず、オンチェーンでも実行されません。証明付きで実行する場合は [`leo execute`](08_execute.md) を使用してください。

コマンドラインから入力を与えて実行するには次を実行します。
```bash
leo run <TRANSITION_NAME> <INPUTS>
```

`<TRANSITION_NAME>` には実行する `transition`／`async transition` 名、`<INPUTS>` にはスペース区切りで並べた入力値を指定します。

このコマンドは回路の合成や証明鍵・検証鍵の生成は行いません。

```bash title="sample output:"
       Leo     ... statements before dead code elimination.
       Leo     ... statements after dead code elimination.
       Leo     The program checksum is: '[...]'.
       Leo ✅ Compiled '{PROGRAM_NAME}.aleo' into Aleo instructions.

⛓  Constraints

 •  '{PROGRAM_NAME}.aleo/{FUNCTION_NAME}' - ... constraints (called 1 time)

➡️  Outputs

 • {OUTPUT_0}
 • {OUTPUT_1}
 ...
```

入力に負の値（`-` で始まる値）が含まれる場合、コマンドライン引数として誤認されないよう `--` で区切ってください。
```bash
leo run <TRANSITION_NAME> -- <INPUT_0> -- <INPUT_1> ...
```

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
--private-key <PRIVATE_KEY>
    The private key to use for the deployment. Overrides the `PRIVATE_KEY` environment variable.
--network <NETWORK>
    The network to deploy to. Overrides the `NETWORK` environment variable.
--endpoint <ENDPOINT>
    The endpoint to deploy to. Overrides the `ENDPOINT` environment variable.
--devnet
    Whether the network is a devnet. If not set, defaults to the `DEVNET` environment variable.
--consensus-heights <CONSENSUS_HEIGHTS>
    Optional consensus heights to use. This should only be set if you are using a custom devnet.
```
