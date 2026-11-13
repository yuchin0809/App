# Macなしで App Store に出す手順（水抜き:音波クリーナー）

アプリ本体は Expo (React Native) で作ってあり、Apple の Mac なしで **EAS（Expoのクラウドビルド）** からビルド・提出します。

## あなたがやること（Appleのログインが必要な部分）

### 0. 事前準備（1回だけ）
1. https://expo.dev で無料アカウントを作る。
2. `docs/support.html` の `[サポート用メールアドレス…]` を実際のメールに書き換える（審査で必須）。
3. このリポジトリをGitHubで `main` に取り込み、Settings → Pages → Branch: `main` / `/docs` を選ぶ。
   公開後に https://yuchin0809.github.io/App/privacy.html と support.html が開けるか確認する。

### 1. App Store Connect でアプリを登録
https://appstoreconnect.apple.com → アプリ → ＋ → 新規App
- プラットフォーム: iOS / 名前: `水抜き:音波クリーナー` / 主言語: 日本語
- バンドルID: `com.yuchin0809.suinukisonic`（Apple Developer の Identifiers で先に作成。`app.json` の bundleIdentifier と同じにする）
- SKU: `suinuki-sonic-001`

### 2. ビルドして提出（パソコンのターミナルで）
```bash
npm install
npm install -g eas-cli
eas login                      # Expoアカウント
eas build --platform ios --profile production   # Appleのログイン/2段階認証を聞かれる。証明書は自動作成を選ぶ
eas submit --platform ios --latest              # App Store Connectにアップロード
```
ビルドは約15〜30分。完了後、App Store Connect の「TestFlight」に現れます。まず自分のiPhoneで TestFlight から動作確認してください。

### 3. ストア情報を入力
- 文章: `docs/store/listing.md`（日本語/英語）
- アイコン: 自動（アプリ内の `assets/icon.png` を使用）。App Store用1024pxも `docs/store/icon-1024.png`
- スクリーンショット: iPhone 6.9インチ（1320×2868）を最低1枚。TestFlight版の画面を撮る。
- 価格: 無料 / App Privacy: 「データを収集しない」 / 年齢制限: 4+
- 「審査に提出」を押す。

## 注意
- 審査では「水が必ず抜ける」と取れる表現がNGです。文章はそれを避けて書いてあります。
- 類似アプリが多いため、リジェクトされたら理由を教えてください。文章・機能を調整します。
