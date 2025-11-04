---
id: token
title: A Custom Token in Leo
---
[general tags]: # (example, token, record, program, transition, future, async_transition, async_function)

**[Source Code](https://github.com/ProvableHQ/leo-examples/tree/main/token)**

## 概要

Leo で実装した透明（公開）トランザクションと秘匿トランザクションを兼ね備えたカスタムトークンの例です。

## 実行方法

[Leo のインストール手順](https://docs.leo-lang.org/getting_started/installation) に従って環境を準備してください。

このトークンプログラムは次の bash スクリプトで実行できます。ローカル環境で実行すると、公開・非公開のトークン発行および送金を Leo プログラムで体験できます。


```bash
cd leo/examples/token
./run.sh
```

`.env` ファイルには秘密鍵とネットワーク種別が記載されています。これはトランザクションの署名やレコード所有権の検証に用いるアカウントです。主体を切り替えて操作する場合は、`.env` の `private_key` を適切な値に変更してください。主体の切り替え例は `./run.sh` にも記載されています。

## チュートリアルの流れ

* [ステップ 0: 公開ミント](#step0)
* [ステップ 1: 秘匿ミント](#step1)
* [ステップ 2: 公開送金](#step2)
* [ステップ 3: 秘匿送金](#step3)
* [ステップ 4: 公開 → 秘匿の変換](#step4)
* [ステップ 5: 秘匿 → 公開の変換](#step5)

以降の操作では 2 人の主体間で移転を行います。

```bash
The private key and address of Alice.
private_key: APrivateKey1zkp1w8PTxrRgGfAtfKUSq43iQyVbdQHfhGbiNPEg2LVSEXR
address: aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q

The private key and address of Bob.
private_key: APrivateKey1zkpFo72g7N9iFt3JzzeG8CqsS5doAiXyFvNCgk2oHvjRCzF
address: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z
```

## <a id="step0"></a> 公開ミント

まずはアリス役になり、公開で 100 トークンをミントします。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp1w8PTxrRgGfAtfKUSq43iQyVbdQHfhGbiNPEg2LVSEXR
" > .env

leo run mint_public aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q 100u64
```
Output
```bash
 • {
  program_id: token.aleo,
  function_name: mint_public,
  arguments: [
    aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q,
    100u64
  ]
}
```

`mint_public` の出力から、公開ミントではアリスのアドレスと発行量が引数として利用されていることがわかります。この情報はオンチェーンに公開され、ネットワークから参照可能です。

## <a id="step1"></a> 秘匿ミント

次にボブのために 100 トークンを秘匿ミントします。ボブの秘密鍵に切り替えて `mint_private` を実行します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpFo72g7N9iFt3JzzeG8CqsS5doAiXyFvNCgk2oHvjRCzF
" > .env

leo run mint_private aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z 100u64
```
Output
```bash
 • {
  owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
  amount: 100u64.private,
  _nonce: 4719474923967087502681846187174640869781874305919806595754990568074403149805group.public
}
```

出力はボブが所有するプライベートレコードです。

## <a id="step2"></a> 公開送金

アリスからボブへ公開で 10 トークンを送金します。アリスの秘密鍵に戻し、公開送金のトランジションを呼び出します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp1w8PTxrRgGfAtfKUSq43iQyVbdQHfhGbiNPEg2LVSEXR
" > .env

leo run transfer_public aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z 10u64
```
Output
```bash
 • {
  program_id: token.aleo,
  function_name: transfer_public,
  arguments: [
    aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q,
    aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z,
    10u64
  ]
}
```

`transfer_public` の finalize にはアリスとボブのアドレス、送金額が引数として渡されていることがわかります。公開マッピングはオンチェーンで参照できます。

## <a id="step3"></a> 秘匿送金

ボブからアリスに 20 トークンを秘匿送金します。ボブの秘密鍵に切り替え、秘匿送金トランジションを呼び出します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpFo72g7N9iFt3JzzeG8CqsS5doAiXyFvNCgk2oHvjRCzF
" > .env

leo run transfer_private "{
    owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
    amount: 100u64.private,
    _nonce: 6586771265379155927089644749305420610382723873232320906747954786091923851913group.public
}" aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q 20u64
```
Output
```bash
 • {
  owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
  amount: 80u64.private,
  _nonce: 7402942372117092417133095075129616994719981532373540395650657400913787695842group.public
}
 • {
  owner: aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q.private,
  amount: 20u64.private,
  _nonce: 2444690320093734417295179000152972034731859256625211879727315719617371330248group.public
}
```

`transfer_private` の出力は、ボブの保有量から 20 トークンを差し引いたレコードと、アリスに 20 トークンを渡したレコードの 2 つです。

## <a id="step4"></a> 公開 → 秘匿の変換

アリスが保有する公開トークン 30 枚を、ボブのプライベートトークン 30 枚に変換してみます。アリスの秘密鍵に戻します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp1w8PTxrRgGfAtfKUSq43iQyVbdQHfhGbiNPEg2LVSEXR
" > .env

leo run transfer_public_to_private aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z 30u64
```
Output
```bash
 • {
  owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
  amount: 30u64.private,
  _nonce: 2372167793514585424629802909684994302673167688345985265672131682042636755887group.public
}
 • {
  program_id: token.aleo,
  function_name: transfer_public_to_private,
  arguments: [
    aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q,
    30u64
  ]
}
```

`transfer_public_to_private` を呼び出すと、オンチェーンで実行されるコードとその入力を表す `Future` が出力されます。

## <a id="step5"></a> 秘匿 → 公開の変換

最後に、ボブのプライベートトークン 40 枚をアリスの公開トークン 40 枚に変換します。ボブの秘密鍵に切り替えます。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpFo72g7N9iFt3JzzeG8CqsS5doAiXyFvNCgk2oHvjRCzF
" > .env

leo run transfer_private_to_public "{
    owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
    amount: 80u64.private,
    _nonce: 1852830456042139988098466781381363679605019151318121788109768539956661608520group.public
}" aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q 40u64
```
Output
```bash
 • {
  owner: aleo17vy26rpdhqx4598y5gp7nvaa9rk7tnvl6ufhvvf4calsrrqdaqyshdsf5z.private,
  amount: 40u64.private,
  _nonce: 2233440107615267344685761424001099994586652279869516904008515754794838882197group.public
}
 • {
  program_id: token.aleo,
  function_name: transfer_private_to_public,
  arguments: [
    aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q,
    40u64
  ]
}
```

`transfer_private_to_public` を呼び出すと、ボブが持っていた 110 トークンのレコードから 40 トークン分を公開転換し、ボブの残高 70 トークンを保持したレコードと、オンチェーンで実行される `Future` が出力されます。
