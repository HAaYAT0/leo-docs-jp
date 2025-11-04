---
id: auction
title: A Private Auction using Leo
---
[general tags]: # (example, auction, record, program, transition, assert)

**[Source Code](https://github.com/ProvableHQ/leo-examples/tree/main/auction)**

## 概要

第一価格密封入札（ブラインドオークション）は、各参加者が他の入札価格を知らないまま入札額を提出し、最も高い入札者が落札する形式のオークションです。

このモデルでは、関係者はオークション主催者と入札者の 2 種類に分かれます。
- **入札者**: オークションに参加して入札する主体。
- **オークション主催者**: オークション全体の進行を担う主体。

今回のオークションについて、次の前提を置きます。
- 主催者は誠実であり、受け取った順番通りに **すべて** の入札を処理し、不正に改ざんしない。
- 入札件数に制限はない。
- 主催者は全入札者の正体を把握しているが、入札者同士は互いの正体を知る必要はない。

このモデルの下で満たしたい要件は次のとおりです。
- 各入札者は、他の入札額に関する情報を一切得られないこと。

## オークションの流れ

オークションは複数の段階で進行します。
- **入札**: 入札フェーズでは、入札者が `place_bid` 関数を呼び出して主催者に入札を提出します。
- **決済**: 決済フェーズでは、主催者が受け取った順番通りに入札を処理します。`resolve` 関数を呼び出し、最終的に勝者となる 1 件の入札レコードを決定します。
- **終了**: 最後に主催者が `finish` 関数を呼び出してオークションを終了させます。この関数は勝者の入札レコードを入札者に返し、落札物の受け取りに使用できるようにします。

## 登場する言語機能・概念
- `record` 宣言
- `assert_eq`
- レコードの所有権

## 実行方法

[Leo のインストール手順](https://docs.leo-lang.org/getting_started/installation) に従って環境を用意してください。

このオークションプログラムは次の bash スクリプトで実行できます。ローカル環境で実行すると、3 人の入札者を想定した一連の入札と決済の流れを Leo プログラムで再現します。

```bash
cd leo/examples/auction
./run.sh
```

`.env` ファイルには秘密鍵とアドレスが定義されています。これはトランザクションの署名やレコード所有権の検証に利用されるアカウントです。別の主体としてプログラムを実行する際は、`.env` の `private_key` を該当の秘密鍵に差し替えてください。`./run.sh` では主体を切り替えて実行する例を記述しているので、あわせて確認すると流れが掴みやすくなります。

## チュートリアルの流れ

* [ステップ 0: オークションの初期化](#step0)
* [ステップ 1: 1 人目の入札](#step1)
* [ステップ 2: 2 人目の入札](#step2)
* [ステップ 3: 勝者の決定](#step3)
* [ステップ 4: オークションの終了](#step4)

## <a id="step0"></a> ステップ 0: オークションの初期化

ここでは次の 3 つの主体をエミュレートします。

```markdown
Bidder 1 Private Key:  
APrivateKey1zkpG9Af9z5Ha4ejVyMCqVFXRKknSm8L1ELEwcc4htk9YhVK
Bidder 1 Address: 
aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke

Bidder 2 Private Key:
APrivateKey1zkpAFshdsj2EqQzXh5zHceDapFWVCwR6wMCJFfkLYRKupug
Bidder 2 Address:
aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4

Auctioneer Private Key:
APrivateKey1zkp5wvamYgK3WCAdpBQxZqQX8XnuN2u11Y6QprZTriVwZVc
Auctioneer Address:
aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh
```

## <a id="step1"></a> ステップ 1: 1 人目の入札

1 人目の入札者が 10 を入札するシナリオです。

`.env` を 1 人目の入札者の秘密鍵とアドレスに差し替えます。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpG9Af9z5Ha4ejVyMCqVFXRKknSm8L1ELEwcc4htk9YhVK
ENDPOINT=https://localhost:3030
" > .env
``` 

`place_bid` プログラム関数を 1 人目の入札者と `10u64` を引数にして呼び出します。

```bash
leo run place_bid aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke 10u64
```
出力:
```bash
 • {
  owner: aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke.private,
  bidder: aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke.private,
  amount: 10u64.private,
  is_winner: false.private,
  _nonce: 4668394794828730542675887906815309351994017139223602571716627453741502624516group.public
}
```
## <a id="step2"></a> ステップ 2: 2 人目の入札

続いて 2 人目の入札者が 90 を入札します。

`.env` を 2 人目の入札者の秘密鍵に置き換えます。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpAFshdsj2EqQzXh5zHceDapFWVCwR6wMCJFfkLYRKupug
ENDPOINT=https://localhost:3030
" > .env
```

`place_bid` プログラム関数を 2 人目の入札者と `90u64` を引数にして呼び出します。

```bash
leo run place_bid aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4 90u64
```
出力:
```bash
 • {
  owner: aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4.private,
  bidder: aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4.private,
  amount: 90u64.private,
  is_winner: false.private,
  _nonce: 5952811863753971450641238938606857357746712138665944763541786901326522216736group.public
}
```
## <a id="step3"></a> ステップ 3: 勝者の決定

主催者が勝者を決定します。

`.env` を主催者の秘密鍵に差し替えます。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp5wvamYgK3WCAdpBQxZqQX8XnuN2u11Y6QprZTriVwZVc
ENDPOINT=https://localhost:3030
" > .env
```

2 件の `Bid` レコードを `resolve` トランジション関数の入力として与えます。

```bash 
leo run resolve "{
    owner: aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh.private,
    bidder: aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke.private,
    amount: 10u64.private,
    is_winner: false.private,
    _nonce: 4668394794828730542675887906815309351994017139223602571716627453741502624516group.public
}" "{
    owner: aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh.private,
    bidder: aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4.private,
    amount: 90u64.private,
    is_winner: false.private,
    _nonce: 5952811863753971450641238938606857357746712138665944763541786901326522216736group.public
}"
```

## <a id="step4"></a> ステップ 4: オークションの終了

勝者の `Bid` レコードを渡して `finish` トランジション関数を呼び出します。

```bash 
leo run finish "{
    owner: aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh.private,
    bidder: aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4.private,
    amount: 90u64.private,
    is_winner: false.private,
    _nonce: 5952811863753971450641238938606857357746712138665944763541786901326522216736group.public
}"
```

お疲れさまでした。これでプライベートオークションの一連の流れを実行できました。[provable.tools](https://provable.tools) を利用して新しいアカウントを生成し、別アドレスでも同じコマンドを試してみるのもおすすめです。
