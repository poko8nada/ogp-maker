# MVP実装タスク (tasks-mvp.md)

## 依存関係のセットアップ

- 必要なパッケージのインストール
  - [ ] `satori` インストール
  - [ ] `yoga-wasm-web` インストール
  - [ ] `svg2png-wasm` インストール
  - [ ] `vitest` インストール
  - [ ] `typescript` インストール（typecheck 用）
- `package.json` へのスクリプト追加
  - [ ] `test` スクリプト追加 (`vitest run`)
  - [ ] `lint` スクリプト追加 (`biome check .`)
  - [ ] `format` スクリプト追加 (`biome format --write .`)
  - [ ] `typecheck` スクリプト追加 (`tsc --noEmit`)
- `wrangler.jsonc` 設定
  - [ ] `r2_buckets` に `BUCKET` バインディングを追加
  - [ ] ローカル再現方式を決め、必要なら `remote: true` を設定
- seed 方針準備
  - [ ] `wrangler r2 object put` ベースの seed 手順を README 下書き
  - [ ] 開発環境の動作確認 `pnpm run dev` でエラーが出ないことを確認

**完了条件**: 依存導入後に `dev` と `cf-typegen` が動作し、R2 バインディングと seed 方針が確定していること

## リクエスト検証ロジック実装

### FR-01: OGP API の入力検証

- `src/ogp/validateRequest.ts`
  - [ ] `validateOgpQuery` 実装（slug/title 必須、title 長さ上限）
- `src/ogp/validateRequest.test.ts`
  - [ ] 正常系: 妥当な slug/title を受理
  - [ ] 異常系: 未入力・不正文字・長すぎる title を拒否
- `src/index.ts`
  - [ ] `/ogp` ルートで検証関数を呼び、400 応答に接続

**完了条件**: バリデーション正常/異常の最小テストが通り、異常入力が 400 で返ること

## slug 検証 (R2) 実装

### FR-02: R2 による存在確認

- `src/ogp/checkSlug.ts`
  - [ ] `checkSlugExists(bucket, slug)` 実装
- `src/ogp/checkSlug.test.ts`
  - [ ] `R2Bucket.head` のモックで存在/非存在を検証
- `src/index.ts`
  - [ ] 検証成功後に slug 存在確認し、非存在時 404 を返却
- `wrangler.jsonc`
  - [ ] `r2_buckets` バインディングを実設定する（コメントでなく実値）

**完了条件**: 非存在 slug は必ず 404 になり、既存 slug のみ生成フローへ進むこと

## OGP 画像生成コア実装

### FR-03: Satori + svg2png-wasm

- `src/ogp/getFont.ts`
  - [ ] Noto Sans JP 取得ロジック実装（Cache API 対応前提）
- `src/ogp/renderOgp.ts`
  - [ ] JSX → SVG (`satori`) 実装
  - [ ] SVG → PNG (`svg2png-wasm`) 実装
- `assets/ogp/background.png`
  - [ ] ユーザー提供画像を配置し、読み込みパスを確定
- `src/ogp/renderOgp.test.ts`
  - [ ] レンダリング関数の正常系・失敗系を検証
- `src/index.ts`
  - [ ] `/ogp` ルートに描画処理を接続して `image/png` 返却

**完了条件**: `/ogp?slug=...&title=...` で、背景画像合成済みの PNG 応答を返せること

## キャッシュとレスポンス最適化

### FR-04: Cache API + CDN

- `src/ogp/cache.ts`
  - [ ] `findCachedImage` 実装
  - [ ] `storeCachedImage` 実装（`ctx.waitUntil`）
- `src/index.ts`
  - [ ] キャッシュヒット時の即時返却を実装
  - [ ] `Cache-Control` 等のヘッダ付与
- `docs/requirement-mvp.md`
  - [ ] キャッシュ仕様との差分があれば更新

**完了条件**: 同一パラメータの再アクセスでキャッシュ応答が返ること

## セキュリティガードと運用設定

### FR-05: 公開運用の最低限防御

- `src/index.ts`
  - [ ] 補助的な UA/Referer ガードミドルウェアを追加
  - [ ] エラーレスポンスを 4xx/5xx で明確化
- `wrangler.jsonc`
  - [ ] 本番 URL・変数・バインディングの最終整理
- `README.md`
  - [ ] ローカル検証 URL と本番想定 URL を追記

**完了条件**: 不正アクセスを最低限抑制し、ローカル/本番の運用手順が README に明示されること

## ローカル seed 導線の実装

### FR-06: ローカル R2 seed

- `README.md`
  - [ ] `wrangler r2 object put` を使った seed 手順を記載
  - [ ] seed 後の動作確認 URL を記載
- `scripts/seed-r2.ts`
  - [ ] 任意で seed 自動化スクリプトを実装
- `package.json`
  - [ ] 任意で `seed:r2` スクリプトを追加

**完了条件**: 新規環境でも seed 手順だけで slug 検証フローを再現できること

---

## リスク項目（要監視）

- [ ] **依存リスク**: WASM 依存追加により Worker サイズ制限を超える可能性
- [ ] **実行制約リスク**: 画像初回生成時の CPU 使用量が高くなる可能性
- [ ] **運用リスク**: Custom Domain 未設定時に期待したキャッシュ動作にならない可能性
- [ ] **開発リスク**: seed 未整備でローカル再現ができず検証品質が落ちる可能性

## 検証・最適化・デプロイ (Validation & Deployment)

- ブラウザ互換性テスト（手動確認）
  - [ ] Chrome latest: `/ogp` 直アクセスで画像表示
  - [ ] Safari latest: `/ogp` 直アクセスで画像表示
- テスト実行
  - [ ] 単体テスト実行 `pnpm run test` がパス
- 型・品質確認
  - [ ] `pnpm run typecheck` がパス
  - [ ] `pnpm run lint` がパス
- デプロイ確認
  - [ ] `pnpm run deploy` 実行可能

**完了条件**: テスト・型・lint が通り、デプロイ可能な状態であること

---

## チェックリスト（デプロイ前確認）

- [ ] `slug + title` 仕様で API が動作
- [ ] R2 検証、キャッシュ、エラーハンドリングが有効
- [ ] `wrangler.jsonc` の `r2_buckets` 実設定が完了
- [ ] `assets/ogp/` 画像が配置され描画に反映
- [ ] OGP 画像が主要 SNS クローラーで取得可能
- [ ] 単体テストがパス（`pnpm run test`）
- [ ] 環境変数・R2 バインディング設定確認
- [ ] v1 以降への移行メモ更新（`docs/requirement-mvp.md`）
