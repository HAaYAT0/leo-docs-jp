---
id: basic_bank
title: A Basic Bank using Leo
---
[general tags]: # (example, bank, record, program, transition, assert, hash, loops, mappings, async_transition, async_function)

**[Source Code](https://github.com/ProvableHQ/leo-examples/tree/main/basic_bank)**

## 概要

このプログラムは、利用者にトークンを発行し、預入によって単利で利息を得られる銀行を実装しています。

### ユーザーフロー
1. 銀行が `issue` 関数で利用者にトークンを発行する。
2. 利用者が `deposit` 関数を通じてトークンを預け入れる。
3. 利用者が引き出しを要求すると、銀行が複利で利息額を計算し、`withdraw` 関数で元本と利息を支払う。

このプログラムは簡単に拡張でき、たとえば `transfer` 関数を追加すれば利用者同士でトークンを送金する機能も実装できます。

## 既知の不具合

すでにお気づきかもしれませんが、このプログラムにはいくつか不具合があります。代表的なものを挙げます。
- `withdraw` は銀行からしか呼び出せません。不正な銀行であればユーザーのトークンをロックしてしまう可能性があります。
- 利息と元本の合計がユーザーの残高を超えると `withdraw` が失敗します。
- 利用者は引き出し直前を含めて何度でも預入できるため、元本を意図的に増やせてしまいます。
- 整数除算では小数点以下が切り捨てられるため、計算結果が小さすぎると利息が 0 になってしまいます。

ほかにも問題点がないか探してみてください。

もちろん、ここで挙げた問題を解消したバージョンを書くことも可能です。読者が取り組む練習課題としておすすめです。

## 登場する言語機能・概念
- `record` 宣言
- `assert_eq`
- `BHP256::hash` などのコア関数
- レコードの所有権
- ループと有界反復
- マッピング
- async/await

## 実行方法

[Leo のインストール手順](https://docs.leo-lang.org/getting_started/installation) に従って環境を整えます。

この基本的な銀行プログラムは次の bash スクリプトで実行できます。ローカル環境で実行すると、銀行とユーザーの間でトークンを発行・預入・引き出しする一連のフローを Leo プログラムで再現します。

```bash
cd leo/examples/basic_bank
./run.sh
```

`.env` ファイルには秘密鍵とアドレスが含まれています。これはトランザクションの署名やレコード所有権の検証に使用するアカウントです。主体を切り替えてプログラムを実行する場合は、`.env` の `private_key` を適切な値に変更してください。`./run.sh` には主体を切り替えて実行する完全な例が書かれているので参考になります。

## チュートリアルの流れ

* [ステップ 0: トークンの発行](#issue)
* [ステップ 1: トークンの預入](#deposit)
* [ステップ 2: 時間経過](#wait)
* [ステップ 3: トークンの引き出し](#withdraw)

## トークンの発行 {#issue}

ここでは 2 つの主体を使い分けます。

```bash
The private key and address of the bank.
private_key: APrivateKey1zkpHtqVWT6fSHgUMNxsuVf7eaR6id2cj7TieKY1Z8CP5rCD
address: aleo1t0uer3jgtsgmx5tq6x6f9ecu8tr57rzzfnc2dgmcqldceal0ls9qf6st7a

The private key and address of the user.
private_key: APrivateKey1zkp75cpr5NNQpVWc5mfsD9Uf2wg6XvHknf82iwB636q3rtc
address: aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg
```

銀行役として処理を進め、ユーザーに 100 トークンを発行してみます。`.env` に銀行の秘密鍵を設定し、`issue` トランジション関数を呼び出します。引数は発行先のアドレスと発行量です。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpHtqVWT6fSHgUMNxsuVf7eaR6id2cj7TieKY1Z8CP5rCD
" > .env

leo run issue aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg 100u64
```
出力
```bash
 • {
  owner: aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg.private,
  amount: 100u64.private,
  _nonce: 5747158428808897699391969939084459370750993398871840192272007071865455893612group.public
}
```

## トークンの預入 {#deposit}

次に、ユーザーが 50 トークンを銀行に預ける操作を行います。ユーザー役になり、銀行から発行されたレコードを入力として `deposit` 関数を呼び出します。引数は `issue` で得た出力レコードと、預け入れたいトークン量です。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp75cpr5NNQpVWc5mfsD9Uf2wg6XvHknf82iwB636q3rtc
" > .env

leo run deposit "{
    owner: aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg.private,
    amount: 100u64.private,
    _nonce: 4668394794828730542675887906815309351994017139223602571716627453741502624516group.public
}"  50u64
```
出力
```bash
 • {
  owner: aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg.private,
  amount: 50u64.private,
  _nonce: 832449386206374072274231152033740843999312028336559467119808470542606777523group.public
}
 • {
  program_id: basic_bank.aleo,
  function_name: deposit,
  arguments: [
    1197470102489602745811042362685620817855019264965533852603090875444599354527field,
    50u64
  ]
}
```

出力には、ユーザーが所有する 50 クレジットの新しいプライベートレコードと、オンチェーンで実行されるコードとその入力を表す `Future` が含まれていることがわかります。

## 時間経過 {#wait}

50 トークンの預入に対し、年率 12.34% の複利で 15 期間経過したと仮定します。

計算してみると、これらの数値では 266 トークンが利息として増えることになります。

## トークンの引き出し {#withdraw}

15 期間経過後、銀行がトークンを引き出す処理を行います。銀行役に戻り、`withdraw` トランジション関数を呼び出します。引数は受取人のアドレス、元本、金利、期間です。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpHtqVWT6fSHgUMNxsuVf7eaR6id2cj7TieKY1Z8CP5rCD
" > .env

leo run withdraw aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg 50u64 1234u64 15u64
```
出力
```bash
 • {
  owner: aleo1zeklp6dd8e764spe74xez6f8w27dlua3w7hl4z2uln03re52egpsv46ngg.private,
  amount: 266u64.private,
  _nonce: 7051804730047578560256662070932795007350207323461845976313826737097831996144group.public
}
 • {
  program_id: basic_bank.aleo,
  function_name: withdraw,
  arguments: [
    1197470102489602745811042362685620817855019264965533852603090875444599354527field,
    50u64
  ]
}
```
この結果、ユーザーには 266 トークンを含む新しいプライベートレコードが作成され、オンチェーンで実行される `Future` が出力されることが確認できます。

```
