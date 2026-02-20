# MVP実装タスク (tasks-mvp.md)

## 依存関係のセットアップ

- 必要なパッケージのインストール
  - [x] `satori` インストール
  - [x] `yoga-wasm-web` インストール
  - [x] `svg2png-wasm` インストール
  - [x] `vitest` インストール（devDependencies）
- `package.json` へのスクリプト追加
  - [x] `test`: `vitest run`
  - [x] `lint`: `biome check .`
  - [x] `format`: `biome format --write .`
  - [x] `typecheck`: `tsc --noEmit`
- Workers設定
  - [x] `wrangler.jsonc` にR2バインド (`BUCKET`) を追加
- [x] `pnpm run dev` で起動できることを確認

**完了条件**: 依存パッケージと基本スクリプトが揃い、Workerがローカル起動できる

---

## リクエスト検証とslug確認の実装

### FR-02: 入力検証とslug存在確認

- `src/ogp/validate.ts`
  - [ ] `validateQuery`:
        `slug` 必須、`title` 文字数制限、許可文字チェックを実装
- `src/ogp/post-exists.ts`
  - [ ] `assertPostExists`:
        R2 `head(posts/{slug}.md)` で存在確認
- `src/ogp/validate.test.ts`
  - [ ] 正常系:
        有効な`slug/title`を受理
  - [ ] 異常系:
        空slug、不正slug、過長titleを拒否
- `src/index.ts`
  - [ ] `/ogp` ルートで検証ロジックを呼び出し、400/404を返す

**完了条件**: 入力不正と記事未存在を明示的に拒否できる

---

## OGPレンダリング基盤の実装

### FR-01: OGP画像生成API

- `src/assets/ogp-icon.png`
  - [x] ブログアイコン素材:
        OGP用PNGをプロジェクト配下へ配置
- `src/ogp/template.tsx`
  - [ ] `OgpTemplate`:
        1200x630前提のテンプレートJSXを実装し、PNGを直接importして配置
- `src/ogp/font.ts`
  - [ ] `getFontData`:
        Google FontsからNoto Sans JPを取得し、Cache APIに保存
- `src/ogp/render.ts`
  - [ ] `renderOgpPng`:
        SatoriでSVG生成後、`svg2png-wasm`でPNG化
- `src/ogp/render.test.ts`
  - [ ] 正常系:
        入力からPNGバイト列を返せる（アイコン合成含む）
  - [ ] 異常系:
        フォント取得失敗時にエラーを返す

**完了条件**: 有効入力でPNG生成が成功する

---

## キャッシュとレスポンス制御の実装

### FR-03 / FR-04: 多層キャッシュ・エラーハンドリング

- `src/ogp/cache.ts`
  - [ ] `getCachedImage`:
        生成済み画像のCache API参照
  - [ ] `putCachedImage`:
        生成後レスポンスを非同期キャッシュ保存
- `src/ogp/error.ts`
  - [ ] `toErrorResponse`:
        400/404/500レスポンスを統一生成
- `src/index.ts`
  - [ ] キャッシュヒット時は即時返却
  - [ ] キャッシュミス時は生成し、長期キャッシュヘッダーを設定して返却
- `src/ogp/cache.test.ts`
  - [ ] 正常系:
        キャッシュヒットで再生成しない
  - [ ] 異常系:
        キャッシュ操作失敗時でも500を返す

**完了条件**: キャッシュ有無の両ケースで期待通りのレスポンスになる

---

## 検証・最適化・デプロイ準備

### 検証

- テスト実行
  - [ ] `pnpm run test` がパス
- 型・品質チェック
  - [ ] `pnpm run typecheck` がパス
  - [ ] `pnpm run lint` がパス
- 手動確認
  - [ ] `GET /ogp?slug=...&title=...` でPNGが返る
  - [ ] 返却画像にブログアイコンが含まれる
  - [ ] 同URL再リクエスト時にキャッシュヒットする

### デプロイ準備

- `README.md`
  - [ ] アイコンアセット配置・R2バインド・デプロイ手順を更新
- `wrangler.jsonc`
  - [ ] 本番向け設定（カスタムドメイン前提）を最終確認

**完了条件**: ローカル検証が完了し、デプロイ手順がREADMEに反映されている

---

## リスク項目（要監視）

- [ ] Workerバンドルサイズ超過: WASM依存が増えるため、`wrangler deploy --dry-run` でサイズ確認を必須化
- [ ] CPU時間超過: 初回生成コストが高いため、キャッシュヒット率を監視
- [ ] R2依存の可用性: `head` 失敗時のフォールバックポリシーを事前定義
- [ ] CDNキャッシュ不発: `workers.dev` では運用せずカスタムドメインを利用
- [ ] アイコン素材の運用: アセット差し替え手順と命名規約を運用化

## チェックリスト（デプロイ前確認）

- [ ] `pnpm run test` がパス
- [ ] `pnpm run typecheck` がパス
- [ ] `pnpm run lint` がパス
- [ ] R2バインド設定が本番環境に反映済み
- [ ] OGP URLがカスタムドメインになっている
- [ ] READMEの運用手順を最新化済み
