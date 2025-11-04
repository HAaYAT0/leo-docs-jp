---
id: sign 
title: 署名と検証
sidebar_label: 署名と検証
---
[general tags]: # (guides, sign, verify, signature, private_key, address)

`leo account` はアカウント作成だけでなく、データへの署名や署名の検証にも利用できます。署名済みデータを入力として扱うタイプのアプリケーションでは特に役立ちます。

## 署名

`leo account sign` コマンドを使うと、Aleo の秘密鍵で暗号学的な署名を生成できます。この署名は、Leo 内の [`signature::verify`](../language/04_operators.md#signatureverify) 関数や `leo account verify` コマンドで検証できます。

Leo/Aleo の値に対して署名を生成するには次を実行します。

```bash
# `5field` を任意の Aleo 値に置き換えてください
leo account sign --private-key {$PRIVATE_KEY} -m 5field

# Output:
sign1...
```

平文に対して署名を生成する場合は `--raw` フラグを使用します。

```bash
# "Hello, Aleo" を任意の平文メッセージに置き換えてください
leo account sign --private-key {$PRIVATE_KEY} -raw -m "Hello, Aleo"

# Output:
sign1...
```

`--private-key` フラグ以外にも以下の指定方法があります。

- `--private-key-file <path/to/file>` — テキストファイルから秘密鍵を読み込む
- フラグなし — 環境変数または `.env` から秘密鍵を読み込む

## 検証

[`leo account sign`](#署名) と対になる `leo account verify` コマンドを使うと、Aleo の値や平文メッセージに対する署名を検証できます。

Aleo 値に対する署名を検証するには次を実行します。

```bash
# `5field` をメッセージに、`sign1signaturehere` を署名に置き換えてください
leo account verify -a {$ADDRESS} -m 5field -s sign1signaturehere

# Output:
✅ The signature is valid

# Error Output:
Error [ECLI0377002]: cli error: ❌ The signature is invalid
```

平文に対する署名を検証する場合は次のようにします。

```bash
# "Hello, Aleo" をメッセージに、`sign1signaturehere` を署名に置き換えてください
leo account verify -a {$ADDRESS} --raw -m "Hello, Aleo" -s sign1signaturehere

# Output:
✅ The signature is valid

# Error Output:
Error [ECLI0377002]: cli error: ❌ The signature is invalid
```
