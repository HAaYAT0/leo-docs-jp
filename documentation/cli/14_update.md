---
id: cli_update
title: ""
sidebar_label: Update
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_update, versioning)

# `leo update`

最新の Leo をダウンロード・インストールするには次を実行します。

```bash
leo update
```

```bash title="console output:"
Checking target-arch... aarch64-apple-darwin
Checking current version... v3.1.0
Checking latest released version... v3.1.0
       Leo 
Leo is already on the latest version
```

特定のバージョンをインストールしたい場合は `--name` フラグで指定します。

```bash
leo update --name v3.0.0
```

### Flags:
#### `-l`
#### `--list`
利用可能な Leo のバージョン一覧を表示します。

#### `-n`
#### `--name`
インストールしたい特定のリリース名を指定します。省略した場合は最新リリースが選択されます。
