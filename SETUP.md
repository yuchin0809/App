# 水抜き:音波クリーナー — 提出メモ

- アプリ: Expo (SDK 58) / bundleIdentifier `com.yuchin0809.suinukisonic`
- PowerShellでは `npx.cmd` / `npm.cmd` を使う（実行ポリシーは変えない）

## 1. プライバシーポリシーの公開（別の公開リポジトリ）
`docs/` の中身（index.html / privacy.html / support.html）を、公開リポジトリ `suinuki-sonic-privacy` に置き、
Settings → Pages → `main` / root を有効にする。URL:
- https://yuchin0809.github.io/suinuki-sonic-privacy/privacy.html
- https://yuchin0809.github.io/suinuki-sonic-privacy/support.html

## 2. App Store Connect
文章は `docs/store/listing.md`。年齢制限は4+、App Privacyは「データ収集なし」、価格は無料。

## 3. ビルドと送信（プロジェクトのフォルダで）
```
npx.cmd eas-cli login
npx.cmd eas-cli build -p ios --profile production
npx.cmd eas-cli submit -p ios --latest
```
質問の答え: プロジェクト作成=Y、Appleログイン=Y、証明書・プロファイル作成=Y、プッシュ通知=n、API Key作成=Y。

## 4. TestFlight
処理完了メールのあと、TestFlightの内部テスターに自分のApple IDを追加し、iPhoneで確認する。
