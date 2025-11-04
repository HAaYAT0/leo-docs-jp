---
id: battleship
title: A Game of Battleship in Leo
---
[general tags]: # (example, battleship, struct, program, transition)

**[Source Code](https://github.com/ProvableHQ/leo-examples/tree/main/battleship)**

## 目次 {#contents}

- [目次](#contents)
- [概要](#summary)
- [実行方法](#how-to-run)
- [1. プレイヤーの初期化](#1-initializing-the-players)
- [2. プレイヤー 1 がボードに艦船を配置](#2-player-1-places-ships-on-the-board)
- [3. プレイヤー 1 からプレイヤー 2 へボードを渡す](#3-player-1-passes-the-board-to-player-2)
- [4. プレイヤー 2 がボードに艦船を配置](#4-player-2-places-ships-on-the-board)
- [5. プレイヤー 2 からプレイヤー 1 へボードを返す](#5-passing-the-board-back-to-player-1)
- [6. プレイヤー 1 の 1 手目](#6-player-1-takes-the-1st-turn)
- [7. プレイヤー 2 の 2 手目](#7-player-2-takes-the-2nd-turn)
- [8. プレイヤー 1 の 3 手目](#8-player-1-takes-the-3rd-turn)
- [9. プレイヤー 2 の 4 手目](#9-player-2-takes-the-4th-turn)
- [10. 勝者の判定](#10-who-wins)
- [ZK Battleship におけるプライバシー](#zk-battleship-privacy)
- [ボードと艦船のモデリング](#modeling-the-board-and-ships)
  - [有効なボード配置の例](#examples-of-valid-board-configurations)
  - [無効なボード配置の例](#examples-of-invalid-board-configurations)
- [艦船を 1 隻ずつ検証する](#validating-a-single-ship-at-a-time)
  - [ビットカウント](#bit-counting)
  - [隣接チェック](#adjacency-check)
  - [行・列をまたいでいないかの確認](#splitting-a-row-or-column)
  - [ビット列が 2 の冪乗かを確認する](#ensuring-a-bitstring-is-a-power-of-2)
- [全艦船を 1 枚のボードで検証する](#validating-all-ships-together-in-a-single-board)
- [ゲーム途中でプレイヤーやボードが入れ替わらないようにする](#ensure-that-players-and-boards-cannot-swap-mid-game)
- [ターン順を強制する](#ensure-that-each-player-can-only-move-once-before-the-next-player-can-move)
- [有効な手と情報共有を強制する](#enforce-constraints-on-valid-moves-and-force-the-player-to-give-their-opponent-information-about-their-opponents-previous-move-in-order-to-continue-playing)
- [勝利条件](#winning-the-game)

## 概要 {#summary}

この Battleship の実装は、現在の Leo が抱える制約の中でも完成度の高いアプリケーション例を示しています。特にビット演算を多用しているため最初は難しく感じられるかもしれませんが、盤面のエンコード方法ゆえに高度なサンプルになっている点をご承知ください。Leo の将来的な改善により、このような実装もさらに簡潔に表現できるようになる見込みです。

Battleship は 2 人対戦ゲームで、各プレイヤーが 8x8 のグリッドに艦船を秘密裏に配置し、交互に相手のマスを攻撃します。相手の艦船をすべて沈めたプレイヤーが勝利します。

本アプリケーションは Aleo コミュニティが公開している [zk-battleship](https://github.com/demox-labs/zk-battleship) を Leo へ移植したものです。コミュニティへの感謝を込めて紹介します。

## 実行方法 {#how-to-run}

[Leo のインストール手順](https://docs.leo-lang.org/getting_started/installation) に従って環境を整えてください。

この Battleship プログラムは次の bash スクリプトで実行できます。ローカル環境では、ボードの生成・艦船の配置・対戦の進行を Leo プログラムで確認できます。

```bash
cd battleship
./run.sh
```

`.env` ファイルには秘密鍵とアドレスが記載されています。これはトランザクション署名やレコード所有権の検証に利用するアカウントです。主体を切り替えて操作する際は、`.env` の `private_key` を適切な値に変更してください。`./run.sh` にも主体切り替えの例が記載されています。

## 1. プレイヤーの初期化 {#1-initializing-the-players}

Battleship をプレイするには、2 人のプレイヤーとそれぞれのボードが必要です。ここでは次の 2 つのアカウントを用います。

```bash
The private key and address of player 1.
private_key: APrivateKey1zkpGKaJY47BXb6knSqmT3JZnBUEGBDFAWz2nMVSsjwYpJmm
address: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy

The private key and address of player 2.
private_key: APrivateKey1zkp86FNGdKxjgAdgQZ967bqBanjuHkAaoRe19RK24ZCGsHH
address: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry
```

## 2. プレイヤー 1 がボードに艦船を配置 {#2-player-1-places-ships-on-the-board}

まずプレイヤー 1 のボードを初期化します。艦船のビット表現については [ボードと艦船のモデリング](#modeling-the-board-and-ships) を参照してください。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpGKaJY47BXb6knSqmT3JZnBUEGBDFAWz2nMVSsjwYpJmm
" > .env

leo run initialize_board 34084860461056u64 551911718912u64 7u64 1157425104234217472u64 aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry
```

出力はプレイヤー 1 が所有する `board_state.record` です。`game_started` フラグは false で、艦船の配置 `ships` は 1157459741006397447u64 になっています。これをビット列にすると次の通りです。

```
0 0 0 1 0 0 0 0
0 0 0 1 0 0 0 0
0 0 0 1 1 1 1 1
1 0 0 0 0 0 0 0
1 0 0 0 0 0 0 0
1 0 0 0 0 0 0 0
1 0 0 0 0 0 0 0
0 0 0 0 0 1 1 1
```

## 3. プレイヤー 1 からプレイヤー 2 へボードを渡す {#3-player-1-passes-the-board-to-player-2}

先ほど生成したレコードを用いてプレイヤー 2 に対戦を申し込みます。

```
leo run offer_battleship "{
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  hits_and_misses: 0u64.private,
  played_tiles: 0u64.private,
  ships: 1157459741006397447u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  game_started: false.private,
  _nonce: 605849623036268790365773177565562473735086364071033205649960161942593750353group.public
}"
```

1 つ目の出力は `game_started` が true に更新された `board_state.record` です。このボードは他の対戦には流用できません。2 つ目の出力はプレイヤー 2 の所有となるダミーの `move.record` で、攻撃座標などはまだ含まれていません。プレイヤー 2 はこれを使って対戦を受諾します。

## 4. プレイヤー 2 がボードに艦船を配置 {#4-player-2-places-ships-on-the-board}

`.env` をプレイヤー 2 の秘密鍵に切り替え、ボードを初期化します。

```bash
echo "
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkp86FNGdKxjgAdgQZ967bqBanjuHkAaoRe19RK24ZCGsHH
" > .env

leo run initialize_board 31u64 2207646875648u64 224u64 9042383626829824u64 aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy
```

`ships` が 9044591273705727u64 となり、ビット列は次のようになります。

```
0 0 1 0 0 0 0 0
0 0 1 0 0 0 1 0
0 0 0 0 0 0 1 0
0 0 0 0 0 0 1 0
0 0 0 0 0 0 1 0
0 0 0 0 0 0 1 0
0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1
```

## 5. プレイヤー 2 からプレイヤー 1 へボードを返す {#5-passing-the-board-back-to-player-1}

プレイヤー 1 の申し出を受諾するため `start_battleship` を実行します。

```bash
leo run start_battleship "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 0u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: false.private,
  _nonce: 677929557867990662961068737825412945684193990901139603462104629310061710321group.public
}" "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  incoming_fire_coordinate: 0u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 6306786918362462465996698473371289503655844751914031374264794338640697795225group.public
}"
```

出力例:

```bash
• {
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 0u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: true.private,
  _nonce: 499506036017893504519951074816367233238764881167148207158107765834843789278group.public
}
• {
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  incoming_fire_coordinate: 0u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 7551593771072417773015833444631669906818701068612998340960968556531564726874group.public
}
```

プレイヤー 2 の `board_state.record` でも `game_started` が true になり、プレイヤー 1 が所有する `move.record` が生成されます。これでプレイを開始する準備が整いました。

## 6. プレイヤー 1 の 1 手目 {#6-player-1-takes-the-1st-turn}

```bash
leo run play "{
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  hits_and_misses: 0u64.private,
  played_tiles: 0u64.private,
  ships: 1157459741006397447u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  game_started: true.private,
  _nonce: 6313341191294792052861773157032837489809107102476040695601777954897783350080group.public
}" "{
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  incoming_fire_coordinate: 0u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 2798663115519921626400765401803177719929914180089719334947022448579691220488group.public
}" 1u64
```

出力例:

```bash
• {
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  hits_and_misses: 0u64.private,
  played_tiles: 1u64.private,
  ships: 1157459741006397447u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  game_started: true.private,
  _nonce: 5833516448655036599597838063894464861371198938108460526636526325286738488235group.public
}
• {
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  incoming_fire_coordinate: 1u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 4383078917685812690935470339923943658033179718952229417171392956492546325808group.public
}
```

プレイヤー 1 の `board_state.record` の `played_tiles` に攻撃座標が追加され、プレイヤー 2 の `move.record` には対応する `incoming_fire_coordinate` が格納されます。

## 7. プレイヤー 2 の 2 手目 {#7-player-2-takes-the-2nd-turn}

```bash
leo run play "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 0u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: true.private,
  _nonce: 6864275139988909612799168784231775829713739147830284979332684562641318182923group.public
}" "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  incoming_fire_coordinate: 1u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 8420474443174402614458578667801578345975509805478103542095622903412594983971group.public
}" 2048u64
```

出力例:

```bash
• {
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 2048u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: true.private,
  _nonce: 6284479302801058138006361960649628992876976428745392660731784830148359328839group.public
}
• {
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  incoming_fire_coordinate: 2048u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  prev_hit_or_miss: 1u64.private,
  _nonce: 8217837260140600949756911248177622179381338760298068527463640818659709985441group.public
}
```

プレイヤー 2 の `board_state.record` にも攻撃座標が記録され、プレイヤー 1 の `move.record` に命中／外れの結果が格納されます。たとえばプレイヤー 2 の最下段は艦船が並んでいるため、1u64 などの座標が命中扱いになります。

## 8. プレイヤー 1 の 3 手目 {#8-player-1-takes-the-3rd-turn}

```bash
leo run play "{
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  hits_and_misses: 0u64.private,
  played_tiles: 1u64.private,
  ships: 1157459741006397447u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  game_started: true.private,
  _nonce: 1962122153746742645258971561783872712461616481157617568489391338473028502271group.public
}" "{
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  incoming_fire_coordinate: 2048u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  prev_hit_or_miss: 1u64.private,
  _nonce: 1204008848449868423802652577996848559012797694551224583683080100053831915439group.public
}" 2u64
```

出力例:

```bash
• {
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  hits_and_misses: 1u64.private,
  played_tiles: 3u64.private,
  ships: 1157459741006397447u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  game_started: true.private,
  _nonce: 5338125050531864311985370830280952305688629865354830939402745656578990650505group.public
}
• {
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  incoming_fire_coordinate: 2u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 7971995563631235472540847437984726419106193784727086463494463811056252801811group.public
}
```

`played_tiles` が 3u64（最後の 2 ビットが立っている）となり、`hits_and_misses` も前回の結果が反映されます。プレイヤー 2 の `move.record` には新しい攻撃座標が格納されます。

## 9. プレイヤー 2 の 4 手目 {#9-player-2-takes-the-4th-turn}

```bash
leo run play "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 2048u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: true.private,
  _nonce: 591128247205636061702123861968396246163831838278146623498909560875485861872group.public
}" "{
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  incoming_fire_coordinate: 2u64.private,
  player_1: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  player_2: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  prev_hit_or_miss: 0u64.private,
  _nonce: 4871574741887919250014604645502780786361650856453535231083359604148337116539group.public
}" 4u64
```

出力例:

```bash
• {
  owner: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  hits_and_misses: 0u64.private,
  played_tiles: 2052u64.private,
  ships: 9044591273705727u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  game_started: true.private,
  _nonce: 4866144015676673398767235148516158177034901439767024502676546368462039477864group.public
}
• {
  owner: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  incoming_fire_coordinate: 4u64.private,
  player_1: aleo1wyvu96dvv0auq9e4qme54kjuhzglyfcf576h0g3nrrmrmr0505pqd6wnry.private,
  player_2: aleo15g9c69urtdhvfml0vjl8px07txmxsy454urhgzk57szmcuttpqgq5cvcdy.private,
  prev_hit_or_miss: 2u64.private,
  _nonce: 5304512645876453228434639693756897952439730718508628026257897445388710294282group.public
}
```

以降も双方が `play` を呼び出し、互いの攻撃結果を `move.record` 経由で共有しながらゲームを進めます。

## 10. 勝者の判定 {#10-who-wins}

`board_state.record` の `hits_and_misses` に立っているビット（命中マス）が合計 14 個になったプレイヤーが勝利です。14 という数は長さ 5・4・3・2 の艦船が占めるマス数の合計です。

## ZK Battleship におけるプライバシー {#zk-battleship-privacy}

艦船の配置を秘匿しつつ、公正で信頼できる対戦を成立させるには、Aleo が提供するゼロ知識証明による選択的プライバシーを活用します。戦略の概要は次の通りです。

1. 艦船の配置に数学的な制約を設け、不正な配置（重ね置き、ボード外、交差など）を防ぐ。
2. ゲーム開始後にプレイヤーやボードがすり替わらないようにする。
3. プレイヤーが相手の手番を待たずに連続で行動できないようにする。
4. 有効な手のみ受け付け、続けてプレイするには相手の前回結果を必ず伝えるよう強制する。

## ボードと艦船のモデリング {#modeling-the-board-and-ships}

多くのプログラムでは 64 文字の文字列や 8x8 の配列でボードを表現しますが、Leo では文字列操作やループが得意ではありません。そこで u64 の各ビットを 1 マスに対応させることで盤面を表現します。空のボードは 0u64 で、8 行 x 8 列すべて 0 のグリッドになります。

艦船は長さ 5 / 4 / 3 / 2 の 4 隻を使用します。艦船は縦または横に配置し、斜めは禁止です。隣接は許容されますが、交差はできません。艦船そのものもビット列で表現できます。

| 長さ | 横向きのビット列 | u64 |
| --- | --- | --- |
| 5 | 11111 | 31u64 |
| 4 | 1111  | 15u64 |
| 3 | 111   | 7u64  |
| 2 | 11    | 3u64  |

縦向きのビット列はビットの間に 7 個の 0 を挟みます。

| 長さ | 縦向きのビット列 | u64 |
| --- | --- | --- |
| 5 | 1 00000001 00000001 00000001 00000001 | 4311810305u64 |
| 4 | 1 00000001 00000001 00000001          | 16843009u64   |
| 3 | 1 00000001 00000001                   | 65793u64      |
| 2 | 1 00000001                            | 257u64        |

これらを OR 演算で重ね合わせれば、複数の艦船を 1 枚のボードに配置できます。

### 有効なボード配置の例 {#examples-of-valid-board-configurations}

17870284429256033024u64
```
1 1 1 1 1 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 1
0 0 0 0 0 0 0 1
1 1 1 1 0 0 0 1
0 0 0 0 0 0 0 0
0 0 0 0 0 0 1 1
0 0 0 0 0 0 0 0
```

16383u64
```
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 1 1 1 1 1 1
1 1 1 1 1 1 1 1
```

2157505700798988545u64
```
0 0 0 1 1 1 0 1
1 1 1 1 0 0 0 1
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 1
0 0 0 0 0 0 0 1
0 0 0 0 0 0 0 1
0 0 0 0 0 0 0 1
0 0 0 0 0 0 0 1
```

### 無効なボード配置の例 {#examples-of-invalid-board-configurations}

最下段の艦船と重なっている例（67503903u64）や、斜めに配置された例（9242549787790754436u64）、行や列をまたいで艦船が分断されている例（1297811850814034450u64）などがあります。こうした配置は無効と判定されます。

これらのルールに従い、まずは個々の艦船ビット列を検証し、すべてが妥当ならボード全体に合成して重なりがないか確認します。

## 艦船を 1 隻ずつ検証する {#validating-a-single-ship-at-a-time}

`verify.aleo` 内で艦船ビット列を検証する処理を確認できます。艦船が有効である条件は以下の通りです。

*横向きの場合*
1. 立っているビット数が艦船の長さと一致する。
2. ビットが連続して並んでいる。
3. 行をまたいでいない。

*縦向きの場合*
1. 立っているビット数が艦船の長さと一致する。
2. ビット同士が縦方向に隣接している（各ビット間は 7 個の 0）。
3. 列をまたいでいない。

ループを使わずにこれらを確認するため、以下のビット演算テクニックを利用します。

### ビットカウント {#bit-counting}

`c_bitcount` クロージャを参照してください。MIT AI Laboratory が公開した HAKMEM の 169 番をベースに、理解しやすい形に調整しています。ビット列を数える際、元の値から右シフトした値を順に引いていくことで 4 ビットごとの合計を得られます。たとえば 13u64（1101）であれば、

```
1101
-0110
-0011
-0001
=0011 (3)
```

この操作を任意のビット長に拡張するため、ビットマスクを組み合わせて 4 ビットごとの合計を求め、さらに 8 ビットごとに集約します。最終的に 255 (2^8 - 1) で剰余を取ると、元のビット列に含まれる 1 の総数が得られます。

まとめると、64 ビット整数 `A` に対し次の式を用います。

```
B = A
    - (A >> 1  & 0x7777777777777777u64)
    - (A >> 2  & 0x3333333333333333u64)
    - (A >> 3  & 0x1111111111111111u64);
C = (B + (B >> 4)) & 0x0F0F0F0F0F0F0F0Fu64;
bit_count = C % 255u64;
```

### 隣接チェック {#adjacency-check}

艦船のビット列と、盤面上での配置ビット列が与えられたとき、両者の割り算の結果が 2 の冪乗であれば、艦船は隣接して配置されています。割り算の結果が 0 になる場合は明らかに不正なので別途除外します。

### 行・列をまたいでいないかの確認 {#splitting-a-row-or-column}

縦方向のチェックは割り算結果が 2 の冪乗かどうかで判断できますが、横方向は行を跨いでもビット数や隣接判定をすり抜ける可能性があります。そこで盤面のビット列を 255 (0b11111111) で剰余を取り 8 ビットに圧縮し、そのビット列に対して改めて隣接チェックを行います。

### ビット列が 2 の冪乗かを確認する {#ensuring-a-bitstring-is-a-power-of-2}

2 の冪乗はビットが 1 つだけ立っているため、`x & (x - 1)` が 0 になれば 2 の冪乗と判定できます。これを各所で利用します。

## 全艦船を 1 枚のボードで検証する {#validating-all-ships-together-in-a-single-board}

個々の艦船ビット列が妥当であれば、それらを OR で合成し 14 ビット立っているか（5 + 4 + 3 + 2 = 14）を確認します。これにより艦船が重なっていないことを保証します。

## ゲーム途中でプレイヤーやボードが入れ替わらないようにする {#ensure-that-players-and-boards-cannot-swap-mid-game}

ボードは `board_state` レコードで管理され、ゲーム開始後は `game_started` フラグが true になります。このレコードは他の対戦には利用できません。`move` レコードは以下のときに生成されます。

1. 対戦を申し込む際、ダミーの `move` レコードが生成され、プレイヤー情報が設定される。
2. 対戦を受諾するとき、ダミーの `move` レコードを消費し、プレイヤー情報をチェックしてから新しい `move` レコードを生成する。
3. `play` を呼ぶ際、前の `move` レコードを必ず消費し、新しい `move` レコードを作成する。

この仕組みにより、ゲーム途中で別のボードやプレイヤーに差し替えることはできません。

## ターン順を強制する {#ensure-that-each-player-can-only-move-once-before-the-next-player-can-move}

`move` レコードを消費しなければ次の `move` レコードを生成できないため、プレイヤーは交互に行動するしかありません。`move` レコードの所有者は手番のたびに相手へ移るようになっています。

## 有効な手と情報共有を強制する {#enforce-constraints-on-valid-moves-and-force-the-player-to-give-their-opponent-information-about-their-opponents-previous-move-in-order-to-continue-playing}

有効な攻撃は単一ビットが立った u64（すなわち 8x8 グリッド上の 1 マス）です。すでに攻撃済みのマスは `played_tiles` に記録され、再度選択すると検証で弾かれます。また `play` を呼ぶと、相手の攻撃結果（命中／外れ）を `move` レコードに含めることが義務付けられており、これを渡さないと次のターンへ進めません。

## 勝利条件 {#winning-the-game}

勝利判定はシンプルで、`board_state.record` の `hits_and_misses` に立っているビットが 14 個に達したプレイヤーが勝ちです。これにより、全艦船が撃沈されたことを確認できます。
