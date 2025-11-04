## Leo Documentation

This repository serves as a public source for documentation source files about Aleo, the Leo programming language, and other tools and concepts.
You can find them in readable form at [Developer Docs](https://docs.leo-lang.org/).
Other resources you may find helpful include:

- [📡 SnarkOS](http://snarkos.org/) - A decentralized operating system for private applications.
- [⚙️ SnarkVM](https://snarkvm.org/) - A virtual machine for zero-knowledge proofs.
- [🦁 Leo](https://leo-lang.org/) - A programming language for zero-knowledge proofs.
- [🛝 Playground](http://play.leo-lang.org) - A browser interface to the Leo compiler for rapid ZK development and testing.
- [🧰 SDK](https://provable.tools/) - A Software Development Kit (SDK) for Aleo.
- [🔭 Explorer](https://explorer.provable.com) - A block explorer for the Aleo network.

You may also find it helpful to join the Aleo community on [Discord](https://discord.com/invite/aleo) to ask or answer questions.

## 日本語サイトについて

このフォークでは Docusaurus を用いて英語の公式ドキュメントを日本語へ直接翻訳する方針を採用しています（i18n 機能は利用しません）。`documentation/` 配下の Markdown をそのまま日本語で上書きすることでサイトに反映されます。

### ローカル開発
- Node.js 18 以上をインストールしてください。
- 依存関係を取得: `npm install`
- 開発サーバー起動: `npm run start`
- 本番ビルド: `npm run build`

翻訳 PR を作成する際は、原文への参照リンク（例: `https://github.com/ProvableHQ/leo-docs-source` 内該当ファイル）を差分に含めるとレビュアーが追従しやすくなります。
