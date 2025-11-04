---
id: vote
title: A Voting Program using Leo
---
[general tags]: # (example, vote, record, program, mapping)

**[Source Code](https://github.com/ProvableHQ/leo-examples/tree/main/vote)**

## 概要

`vote.leo` は汎用的な投票プログラムです。

誰でも提案（プロポーザル）を作成でき、提案者は投票権を表すチケットを有権者に発行できます。有権者は自身の身元を明かすことなく投票できます。

このサンプルは Aleo コミュニティが開発した [aleo-vote](https://github.com/zkprivacy/aleo-vote) から着想を得ています。

## 特徴

- 投票用紙をプライベート入力にすることで、有権者の匿名性が守られます。
- 提案内容と投票結果は、Leo の公開型 `mapping` データ型を用いてオンチェーンで参照できるように公開されます。

## 実行方法

[Leo のインストール手順](https://docs.leo-lang.org/getting_started/installation) に従って環境を整えてください。

この投票プログラムは次の bash スクリプトで実行できます。ローカル環境では、提案の作成・チケットの発行・投票の実行を Leo プログラムで確認できます。

```bash
cd leo/examples/vote
./run.sh
```

`.env` ファイルには秘密鍵とネットワーク種別が記載されています。これはトランザクションの署名やレコード所有権の検証に使用するアカウントです。主体を切り替えてプログラムを実行する場合は、`.env` の `private_key` を適切な値に変更してください。`./run.sh` には主体の切り替え方を含めた完全な例が記載されています。

## チュートリアルの流れ

* [利用する関数](#functions)
* [ステップ 0: 提案の作成](#step0)
* [ステップ 1: 有権者 1 がチケットを発行して投票](#step1)
* [ステップ 2: 有権者 2 がチケットを発行して投票](#step2)
* [ステップ 3: 投票結果の集計](#step3)

## <a id="functions"></a> Functions

### Propose

`propose` 関数を呼び出すことで、誰でも公開提案を作成できます。

### Create Ticket

提案者は投票用のチケットを発行できます。

チケットは `owner` と提案 ID `pid` を持つレコードです。`pid` で識別される提案に投票する際に使用でき、**使用できるのはチケットの所有者のみ** です。つまり **チケットの所有者だけがその `ticket` で投票を行えます**。

### Vote

チケットの所有者は、該当提案 `pid` に対し `agree` / `disagree` で投票できます。チケットはプライベート入力として使用されるため、有権者の匿名性が守られます。

## <a id="step0"></a> 提案の作成

ここでは 3 つの主体を切り替えて操作します。

```bash
The private key and address of the proposer.
private_key: APrivateKey1zkp8wKHF9zFX1j4YJrK3JhxtyKDmPbRu9LrnEW8Ki56UQ3G
address: aleo1rfez44epy0m7nv4pskvjy6vex64tnt0xy90fyhrg49cwe0t9ws8sh6nhhr

The private key and address of voter 1.
private_key: APrivateKey1zkpHmSu9zuhyuCJqVfQE8p82HXpCTLVa8Z2HUNaiy9mrug2
address: aleo1c45etea8czkyscyqawxs7auqjz08daaagp2zq4qjydkhxt997q9s77rsp2

The private key and address of voter 2.
private_key: APrivateKey1zkp6NHwbT7PkpnEFeBidz5ZkZ14W8WXZmJ6kjKbEHYdMmf2
address: aleo1uc6jphye8y9gfqtezrz240ak963sdgugd7s96qpuw6k7jz9axs8q2qnhxc
```
新しい議題を提案してみましょう。提案者になり、`propose` トランジション関数を呼び出します。必要な情報は関数の入力として指定済みです。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp8wKHF9zFX1j4YJrK3JhxtyKDmPbRu9LrnEW8Ki56UQ3G
" > .env

leo run propose "{ 
  title: 2077160157502449938194577302446444field, 
  content: 1452374294790018907888397545906607852827800436field, 
  proposer: aleo1rfez44epy0m7nv4pskvjy6vex64tnt0xy90fyhrg49cwe0t9ws8sh6nhhr
}"
```
出力
```bash

 • {
  owner: aleo1rfez44epy0m7nv4pskvjy6vex64tnt0xy90fyhrg49cwe0t9ws8sh6nhhr.private,
  id: 2805252584833208809872967597325381727971256629741137995614832105537063464740field.private,
  info: {
    title: 2077160157502449938194577302446444field.private,
    content: 1452374294790018907888397545906607852827800436field.private,
    proposer: aleo1rfez44epy0m7nv4pskvjy6vex64tnt0xy90fyhrg49cwe0t9ws8sh6nhhr.private
  },
  _nonce: 7270749279509948287724447377218313625054368902761257869085068499107406906985group.public
}
 • {
  program_id: vote.aleo,
  function_name: propose,
  arguments: [
    2805252584833208809872967597325381727971256629741137995614832105537063464740field
  ]
}
```

出力には提案内容を含む新しいレコードが含まれ、提案 ID を引数とする公開マッピングが設定されます。公開マッピングはオンチェーンで参照可能です。

## <a id="step1"></a> 有権者 1 が投票

投票用のプライベートチケットを発行します。有権者 1 の役割になり、`new_ticket` トランジションを実行します。入力には一意なチケット ID と有権者の公開アドレスを渡します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpHmSu9zuhyuCJqVfQE8p82HXpCTLVa8Z2HUNaiy9mrug2
" > .env

leo run new_ticket 2264670486490520844857553240576860973319410481267184439818180411609250173817field aleo1c45etea8czkyscyqawxs7auqjz08daaagp2zq4qjydkhxt997q9s77rsp2
```
出力
```bash
 • {
  owner: aleo1c45etea8czkyscyqawxs7auqjz08daaagp2zq4qjydkhxt997q9s77rsp2.private,
  pid: 2264670486490520844857553240576860973319410481267184439818180411609250173817field.private,
  _nonce: 3111099913449740827888947259874663727415985369111767658428258317443300847451group.public
}
 • {
  program_id: vote.aleo,
  function_name: new_ticket,
  arguments: [
    2264670486490520844857553240576860973319410481267184439818180411609250173817field
  ]
}
```

チケットの所有者に紐づく新しいプライベートレコードが作成され、投票プログラムにはチケット ID を追跡する公開マッピングが追加されていることがわかります。

有権者 1 はチケットを使って匿名で投票できます。チケットの出力レコードを入力にして `agree` もしくは `disagree` トランジションを呼び出します。

```bash
leo run agree "{
  owner: aleo1c45etea8czkyscyqawxs7auqjz08daaagp2zq4qjydkhxt997q9s77rsp2.private,
  pid: 2264670486490520844857553240576860973319410481267184439818180411609250173817field.private,
  _nonce: 1738483341280375163846743812193292672860569105378494043894154684192972730518group.public
}"
```
出力
```bash
 • {
  program_id: vote.aleo,
  function_name: agree,
  arguments: [
    2264670486490520844857553240576860973319410481267184439818180411609250173817field
  ]
}

```

## <a id="step2"></a> 有権者 2 が投票

有権者 2 のために新しいプライベートチケットを発行します。有権者 2 の役割になり、`new_ticket` トランジションを実行します。入力は一意なチケット ID と公開アドレスです。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp6NHwbT7PkpnEFeBidz5ZkZ14W8WXZmJ6kjKbEHYdMmf2
" > .env

leo run new_ticket 2158670485494560943857353240576760973319410481267184429818180411607250143681field aleo1uc6jphye8y9gfqtezrz240ak963sdgugd7s96qpuw6k7jz9axs8q2qnhxc
```
出力
```bash
 • {
  owner: aleo1uc6jphye8y9gfqtezrz240ak963sdgugd7s96qpuw6k7jz9axs8q2qnhxc.private,
  pid: 2158670485494560943857353240576760973319410481267184429818180411607250143681field.private,
  _nonce: 7213678168429828883374086447188635180072431460350128753904256765278199909612group.public
}
 • {
  program_id: vote.aleo,
  function_name: new_ticket,
  arguments: [
    2158670485494560943857353240576760973319410481267184429818180411607250143681field
  ]
}
```

有権者 2 もチケットを使って匿名で投票できます。チケットの出力レコードを入力にして `agree` もしくは `disagree` を呼び出します。

```bash
leo run disagree "{
  owner: aleo1uc6jphye8y9gfqtezrz240ak963sdgugd7s96qpuw6k7jz9axs8q2qnhxc.private,
  pid: 2158670485494560943857353240576760973319410481267184429818180411607250143681field.private,
  _nonce: 6511154004161574129036815174288926693337549214513234790975047364416273541105group.public
}"
```
出力
```bash
 • {
  program_id: vote.aleo,
  function_name: disagree,
  arguments: [
    2158670485494560943857353240576760973319410481267184429818180411607250143681field
  ]
}
```

## <a id="step3"></a> 投票結果の集計

個々の投票内容はプライベートですが、賛成票と反対票の累計は公開マッピングを通じてオンチェーンに公開されます。必要に応じてオンチェーンから集計結果を照会できます。
