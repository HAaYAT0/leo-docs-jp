import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const features = [
  {
    title: 'クイックスタート',
    description:
      '開発環境の準備から最初のプログラムまで、Leoを日本語で学ぶための導線をまとめています。',
    to: '/docs/installation',
  },
  {
    title: '言語仕様を理解',
    description:
      '構文・型システム・標準ライブラリを含むLeo言語の詳細なリファレンスで、実装時の疑問を素早く解消しましょう。',
    to: '/docs/overview',
  },
  {
    title: 'CLIとツール群',
    description:
      'leoコマンドの各サブコマンド、テスト、デプロイまで網羅。Aleoネットワークで動くアプリを仕上げるためのツールチェーンを解説します。',
    to: '/docs/cli_overview',
  },
];

function Feature({title, description, to}) {
  return (
    <div className={clsx('col col--4', styles.cardCol)}>
      <div className={clsx('card', styles.card)}>
        <div className="card__header">
          <h3>{title}</h3>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--outline button--primary button--block" to={to}>
            詳しく見る
          </Link>
        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Leo ドキュメントへようこそ</h1>
        <p className="hero__subtitle">
          Provableが公開する英語ドキュメントをベースに、日本語ユーザーが迷わず開発を進められるよう構成した非公式翻訳版です。
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/leo">
            ドキュメントを読む
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="日本語版 Leo ドキュメント"
      description="Leo言語を学ぶ日本語開発者のための非公式翻訳サイト。Aleo向けアプリ開発のためのガイドやリファレンスを収録。">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <div className="row">
              {features.map((feature) => (
                <Feature key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
