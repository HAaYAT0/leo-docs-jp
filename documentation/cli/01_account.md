---
id: cli_account
title: ""
sidebar_label: Account
toc_min_heading_level: 2
toc_max_heading_level: 2
---
[general tags]: # (cli, leo_account, account, sign, verify, signature, private_key, view_key, address)

# `leo account`

`leo account` コマンドは、Aleo アカウントの作成や管理、メッセージの署名・検証を行うために使用します。

:::warning
秘密鍵の取り扱いには細心の注意を払いましょう。`leo account` では失われた鍵を復元できません。
:::


# Subcommands
* [`new`](#leo-account-new) - 新しい Aleo アカウントを生成します。
* [`import`](#leo-account-import) - 秘密鍵から Aleo アカウント情報を導出します。
* [`sign`](#leo-account-sign) - Aleo 秘密鍵でメッセージに署名します。
* [`verify`](#leo-account-verify) - Aleo アドレスが生成した署名を検証します。
* [`decrypt`](#leo-account-decrypt) - Aleo の秘密鍵またはビューキーでレコードの暗号文を復号します。

&nbsp;

---


## `leo account new`

[Back to Top](#subcommands)

新しい Aleo アカウントの秘密鍵・ビューキー・アドレスを生成します。

出力は次のようになります。
```bash title="console output:"
  Private Key  APrivateKey1zkp...
     View Key  AViewKey1...
      Address  aleo1...
```


### Flags:
#### `--seed <SEED>`
#### `-s <SEED>`
乱数生成器 (RNG) に使用するシード値を数値で指定します。


#### `--write `
#### `-w`
生成した秘密鍵をカレントディレクトリ (`./`) の `.env` ファイルに書き込みます。


#### `--discreet`
秘密鍵などの機密情報を別画面に表示し、第三者から見えにくくします。


&nbsp;

---


## `leo account import`

[Back to Top](#subcommands)

既存の Aleo 秘密鍵からビューキーとアドレスを導出します。

```bash
leo account import <PRIVATE_KEY>
```
`<PRIVATE_KEY>` には所有している秘密鍵を指定してください。

### Flags:
#### `--write `
#### `-w`
復元した秘密鍵をカレントディレクトリ (`./`) の `.env` ファイルに書き込みます。


#### `--discreet`
機密情報を別画面に表示し、第三者から見えにくくします。

&nbsp;

---

## `leo account sign`

[Back to Top](#subcommands)

Aleo の秘密鍵でメッセージに署名します。

カレントディレクトリが Leo プロジェクトで `.env` に秘密鍵がある、もしくは `$PRIVATE_KEY` 環境変数を設定している場合は、次のコマンドで署名できます。
```bash
leo account sign --message <MESSAGE>
```

### Flags:
#### `--message <MESSAGE>`
#### `-m <MESSAGE>`

:::info
必須のフラグです。
:::

署名対象のメッセージを指定します。

---

#### `--private-key <PRIVATE_KEY>`
署名に使用する秘密鍵を明示的に指定します。`.env` や `$PRIVATE_KEY` に設定された値より優先されます。


#### `--private-key-file <PRIVATE_KEY_FILE>`
`<PRIVATE_KEY_FILE>` で指定したテキストファイルから秘密鍵を読み取ります。`.env` や `$PRIVATE_KEY` に設定された値より優先されます。


#### `--raw `
#### `-r`
メッセージを Aleo リテラルではなくバイト列として解釈します。


&nbsp;

---

## `leo account verify`

[Back to Top](#subcommands)

Aleo アドレスから送信されたメッセージと署名を検証します。

```bash
leo account verify --address <ADDRESS> --signature <SIGNATURE> --message <MESSAGE>
```
`<MESSAGE>` はメッセージ本文、`<SIGNATURE>` は署名、`<ADDRESS>` は署名を生成したアカウントのアドレスです。

### Flags:
#### `--address <ADDRESS>`
#### `-a <ADDRESS>`

:::info
必須のフラグです。
:::

署名を生成したアカウントのアドレスを指定します。


#### `--signature <SIGNATURE>`
#### `-s <SIGNATURE>`

:::info
必須のフラグです。
:::

メッセージの署名を指定します。


#### `--message <MESSAGE>`
#### `-m <MESSAGE>`

:::info
必須のフラグです。
:::

署名されたメッセージ本文を指定します。


#### `--raw `
#### `-r`
メッセージを Aleo リテラルではなくバイト列として解釈します。



## `leo account decrypt`

[Back to Top](#subcommands)

Aleo の秘密鍵またはビューキーでレコードの暗号文を復号します。

秘密鍵を直接指定する場合:
```bash
leo account decrypt --ciphertext <CIPHERTEXT> -k <KEY>
```
`<CIPHERTEXT>` はレコードの暗号文、`<KEY>` はその所有者の秘密鍵またはビューキーです。

ファイルに保存した鍵を利用する場合:
```bash
leo account decrypt --ciphertext <CIPHERTEXT> -f <PATH_TO_KEYFILE>
```

鍵や鍵ファイルを指定しない場合、CLI は `PRIVATE_KEY` と `VIEW_KEY` 環境変数の値を利用しようとします。

秘密鍵がレコードの所有者と一致しない場合、復号に失敗します。

### Flags:
#### `-c <CIPHERTEXT>`
:::info
必須のフラグです。
:::
復号するレコード暗号文を指定します。

#### `-k <KEY>`
復号に使用する秘密鍵またはビューキーを指定します。`-f` フラグと同時には使用できません。

#### `-f <KEY_FILE>`
秘密鍵またはビューキーが記載されたファイルへのパスを指定します。`-k` フラグと同時には使用できません。

#### `--network <NETWORK>`
対象ネットワークを指定します。`.env` や `NETWORK` 環境変数の設定より優先されます。`testnet`、`mainnet`、`canary` を指定できます。
