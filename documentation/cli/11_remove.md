---
id: cli_remove
title: ""
sidebar_label: Remove
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_remove, remove_dependency, dependency, dependency_management, imports)

# `leo remove`

プロジェクトから依存関係を削除するには次を実行します。

```bash
leo remove <NAME>
```
`<NAME>` は削除したいプログラム名です。

詳細は **[Dependency Management](./../guides/02_dependencies.md)** を参照してください。

### Flags:

#### `--all`
すべての依存関係を削除します（`--dev` と併用すると開発用依存関係のみ削除）。

#### `-dev`
開発用依存関係を削除します。
