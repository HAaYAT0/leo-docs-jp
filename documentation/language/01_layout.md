---
id: layout 
title: Leo プロジェクトの構成
sidebar_label: プロジェクト構成
---
[general tags]: # (project, project_layout, manifest, module)

## マニフェスト

**program.json** はパッケージを設定するための Leo のマニフェストファイルです。
```json title="program.json"
{
  "program": "hello.aleo",
  "version": "0.1.0",
  "description": "",
  "license": "MIT",
  "dependencies": null,
  "dev_dependencies": null
}
```

`program` フィールドに記載されたプログラム ID が、デプロイ後に他の開発者が参照できる正式名称になります。
```json
    "program": "hello.aleo",
```

依存関係は追加されるたびに同名のフィールドへ追記されます。依存情報は **leo.lock** にも固定されます。

## コード

`src/` ディレクトリに Leo のソースコードを配置します。プロジェクトのエントリーポイントは同ディレクトリ内の `main.leo` です。多くの CLI コマンドはこのファイルが存在することを前提としているため、必ず用意してください。


### モジュール 

v3.2.0 以降の Leo では、メインファイルに加えてモジュールシステムも利用できます。

末端モジュール（サブモジュールを持たないモジュール）は、`foo.leo` のように 1 ファイルで定義します。サブモジュールを持つモジュールは、任意のトップレベル `.leo` ファイルと、サブモジュールを格納したサブディレクトリで構成します。


例として次の構成を考えてみましょう。
```
src
├── common.leo
├── main.leo
├── outer.leo
└── outer
    └── inner.leo
```

このディレクトリ構成では、以下のモジュールが定義されます。

| Filename | Type | Module Name | Access Location & Pattern |
| -------- | ---- | ----------- | ------------------------- |
| `common.leo` | Module | `common` | `main.leo` : `common::<item>`  |
| `outer.leo` | Module | `outer` | `main.leo` : `outer::<item>` |
| `outer/inner.leo` | Submodule | `outer::inner` |`main.leo` : `outer::inner::<item>` <br></br> `outer.leo` : `inner::<item>`|
:::info
現時点では相対パスのみが利用可能です。たとえば `inner.leo` から `outer.leo` 内の要素を参照することはできません。将来的に絶対パスが導入されれば、この制約は解消される予定です。
:::


モジュールファイルに記述できるのは `struct`、`const`、`inline` 定義のみです。

```leo
const X: u32 = 2u32;

struct S {
    a: field
}

inline increment(x: field) -> field {
    return 1field;
}
```


<!-- 

## テスト

TODO

## ビルドと出力

プロジェクトをコンパイルしたときに生成され、`leo clean` で削除されます。

TODO

-->
