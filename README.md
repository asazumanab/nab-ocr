# NAB AI-OCR

GitHub Pages でそのまま配布できる、PDF向けOCRフロントエンドです。

## 同梱内容

- `index.html`
  GitHub Pages 用の公開フロントエンド
- `assets/logo-japanese-horizontal.png`
  共有可能な相対パスのロゴ
- `apps-script/Code.gs`
  Google スプレッドシート末尾追記用の Apps Script テンプレート

## 配布方法

1. このフォルダを GitHub の新規リポジトリへアップロード
2. GitHub の `Settings > Pages` を開く
3. `Build and deployment` で `Deploy from a branch` を選ぶ
4. `Branch` は `main`、フォルダは `/ (root)` を選んで保存
5. 数分待つと GitHub Pages の公開URLが発行される

## 使い方

1. 公開URLを開く
2. `API Key` で Gemini API キーを保存する
3. PDF をアップロードする
4. `AIで領域を自動特定` または手動ドラッグで抽出項目を作る
5. `全ページ OCR 実行` を押す
6. `出力先` で `CSV保存` か `Googleスプレッドシートへ反映` を選ぶ

## Google スプレッドシート連携

### 小規模運用におすすめの方式

各ユーザーが自分の Google スプレッドシートに紐づく Apps Script Web アプリを1つだけ持つ方式です。

メリット:

- 実装が単純
- GitHub Pages の静的配布と相性がよい
- ユーザーごとに保存先シートを分離しやすい

デメリット:

- 初回だけ各ユーザーが Apps Script をデプロイする必要がある
- 本格SaaSのような一元管理には向かない

### セットアップ手順

1. Google スプレッドシートを新規作成
2. `拡張機能 > Apps Script` を開く
3. `apps-script/Code.gs` の内容を貼り付ける
4. `デプロイ > 新しいデプロイ > ウェブアプリ`
5. `実行ユーザー: 自分`
6. `アクセスできるユーザー: 全員` または運用に合う範囲を選ぶ
7. 発行された Web アプリ URL をコピー
8. フロントエンドの `出力設定` に URL とシート名を保存する

## ユーザーごとに各自のスプレッドシートを使うおすすめ構成

### 今すぐ運用するなら

GitHub Pages + 各ユーザーの Apps Script Web アプリ

理由:

- 最短で公開できる
- 運用コストが低い
- 現在の実装と一致している

### 将来の本命

GitHub Pages + Google ログイン + Sheets API

理由:

- 各ユーザーが Google ログインするだけで、自分のシートに直接書き込める
- Apps Script を各自デプロイさせなくてよい
- スプレッドシート選択UIも作りやすい

ただしこちらは OAuth 同意画面、スコープ設計、必要に応じた審査対応まで含めて別実装になります。
