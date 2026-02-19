# OGP Maker 要件定義書 (requirement-mvp.md)

## 概要 (Overview)

本プロジェクトは、HonoX ブログから参照される OGP 画像を、Cloudflare Workers 上で動的生成・配信するための MVP を構築する。

- **サービス名**
  - OGP Maker
- **目的**
  - 記事ごとのタイトルを反映した OGP 画像を高速かつ低コストで生成し、SNS クローラーへの配信品質を安定化する
- **ターゲット**
  - HonoX ブログ運営者（ユーザー）
  - X / Facebook / Slack / Discord 等で記事共有する読者

---

## 技術スタック (Technology Stack)

### MVP

ライブラリ・パッケージ:

| 項目                      | ライブラリ・フレームワーク・パッケージ |
| ------------------------- | -------------------------------------- |
| バックエンド              | Hono 4.x                               |
| ランタイム / ホスティング | Cloudflare Workers                     |
| OGP レンダリング          | satori, yoga-wasm-web                  |
| SVGからPNG 変換           | svg2png-wasm                           |
| ストレージ (slug 検証)    | Cloudflare R2 binding                  |
| 画像アセット管理          | `assets/ogp/*` (ローカル同梱画像)      |
| キャッシュ                | Cache API + Cloudflare CDN             |
| リンター/フォーマッター   | Biome                                  |
| パッケージマネージャー    | pnpm                                   |
| テスト                    | Vitest                                 |
| デプロイ / 型生成         | Wrangler                               |

スクリプト:

- `dev`: `wrangler dev`
- `deploy`: `wrangler deploy --minify`
- `cf-typegen`: `wrangler types --env-interface CloudflareBindings`
- `test`: `vitest run` (追加予定)
- `lint`: `biome check .` (追加予定)
- `format`: `biome format --write .` (追加予定)
- `typecheck`: `tsc --noEmit` (追加予定)
- `seed:r2`: `wrangler r2 object put <bucket>/<key> -f <file>` (追加予定)

### PRODUCT v1以降

- v1: テンプレート複数種対応（記事カテゴリ別）
- v2: KV/R2 メタデータ活用による subtitle・author などの動的描画拡張

---

## 機能要件 (Functional Requirements)

### FR-01: OGP 生成 API の入力検証

- 要件: `/ogp` エンドポイントで `slug` と `title` を受け取り、入力検証を行う
- 詳細:
  - `slug` は必須、許可文字（英数字・`-`）のみ許容
  - `title` は必須、最大文字数を制限（例: 100 文字）
  - 不正入力は `400 Bad Request` を返す
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/index.ts`
    - `app.get('/ogp', ...)`
  - `src/ogp/validateRequest.ts`
    - `validateOgpQuery(input): Result<OgpQuery, ValidationError>`
    - `type OgpQuery = { slug: string; title: string }`
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常な `slug/title` で検証成功
  - 欠損・超過・禁止文字で検証失敗

### FR-02: slug 存在検証 (R2)

- 要件: `slug` がブログ記事として存在する場合のみ画像生成する
- 詳細:
  - `BUCKET.head(\`posts/${slug}.md\`)` で存在確認
  - 存在しない場合は `404 Not Found` を返す
  - `wrangler.jsonc` の `r2_buckets` へ `BUCKET` をマウントし、ローカル開発では必要に応じて `remote: true` を利用する
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/checkSlug.ts`
    - `checkSlugExists(bucket, slug): Promise<boolean>`
  - `src/index.ts`
    - ルート内で `checkSlugExists` を使用
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 既存 slug で true
  - 非存在 slug で false

### FR-03: SVG/PNG 画像生成

- 要件: `title` から OGP 画像 (1200x630) を生成し PNG で返す
- 詳細:
  - Satori で JSX → SVG
  - svg2png-wasm で SVG → PNG
  - 日本語フォント (Noto Sans JP) を利用
  - ブログで利用する画像アセットを `assets/ogp/` から読み込み、テンプレートに合成する
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/renderOgp.ts`
    - `renderOgpSvg(input): Promise<string>`
    - `renderOgpPng(svg): Promise<Uint8Array>`
  - `src/ogp/getFont.ts`
    - `getCachedFont(cache, fontName): Promise<ArrayBuffer>`
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常入力で PNG バイト列が返る
  - フォント取得失敗時にエラー応答になる

### FR-04: キャッシュ戦略

- 要件: フォント・生成画像をキャッシュし、同一リクエストの再計算を抑制する
- 詳細:
  - フォントを Cache API に保存
  - 生成 PNG を Cache API + CDN で長期キャッシュ
  - `Cache-Control: public, max-age=31536000, immutable` を付与
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/cache.ts`
    - `findCachedImage(request): Promise<Response | undefined>`
    - `storeCachedImage(request, response, ctx): Promise<void>`
  - `src/index.ts`
    - キャッシュヒット時は即時レスポンス
- テスト: 結合テスト
- テスト観点(正常と異常):
  - 初回ミス後にキャッシュ保存される
  - 同一 URL 再アクセスでキャッシュヒットする

### FR-05: セキュリティと公開運用

- 要件: 公開エンドポイントとして最低限の濫用対策を実施する
- 詳細:
  - UA/Referer チェックは補助的に導入可能
  - 文字数制限、slug 検証、WAF レートリミット設定を組み合わせる
  - 重大エラーは 5xx として返し、ログ出力する
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/index.ts`
    - middleware でヘッダ確認
  - `wrangler.jsonc`
    - 必要バインディング・本番変数の明記
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 許可外アクセスが拒否される
  - 想定内ボット UA が通過する

### FR-06: ローカル開発用の R2 seed 運用

- 要件: ローカル開発時に `slug` 検証を再現できる seed 手順を持つ
- 詳細:
  - `wrangler r2 object put` で `posts/{slug}.md` を投入する手順を README に定義
  - 初期 seed 用のサンプルオブジェクト群を用意し、動作確認を容易にする
- 作成予定のファイル・関数・コンポーネント・型など:
  - `scripts/seed-r2.ts` (任意)
    - `seedR2Posts(bucketName, files): Promise<void>`
  - `README.md`
    - ローカル seed コマンド例を記載
- テスト: なし（手動検証）
- テスト観点(正常と異常):
  - seed 後に存在する slug が 200 で返る
  - seed 未投入 slug は 404 のまま

---

## 非機能要件 (Non-Functional Requirements)

### NFR-01: パフォーマンス

- キャッシュヒット時は可能な限り生成処理を回避する
- 未キャッシュ時でも実用速度で応答する（初回生成は許容）

### NFR-02: 互換性

- Cloudflare Workers 環境で動作すること
- 生成画像は主要 SNS クローラーで参照可能な URL 形式で提供すること
- ローカル開発でも R2 seed により本番同等の slug 検証を再現できること

### NFR-03: アクセシビリティ

- API サービスのため UI アクセシビリティ要件は対象外
- 画像文字の可読性（コントラスト・フォントサイズ）は担保する

### NFR-04: セキュリティ

- 入力検証を必須化し、異常値を早期拒否する
- WAF レートリミットを運用設定として適用する

### NFR-05: ライセンスコンプライアンス

| リソース     | 用途           | ライセンス                | クレジット表記     |
| ------------ | -------------- | ------------------------- | ------------------ |
| Noto Sans JP | 日本語フォント | SIL Open Font License 1.1 | 必要時表記         |
| satori       | SVG 生成       | MPL-2.0                   | 依存ライセンス一覧 |
| svg2png-wasm | PNG 変換       | パッケージ準拠            | 依存ライセンス一覧 |

---

## ディレクトリ構成と作成ファイル (Directory Structure & Files)

```
src/
├── index.ts
└── ogp/
    ├── validateRequest.ts
    ├── checkSlug.ts
    ├── getFont.ts
    ├── renderOgp.ts
    ├── cache.ts
    ├── validateRequest.test.ts
    ├── checkSlug.test.ts
    └── renderOgp.test.ts

assets/
└── ogp/
    └── background.png  # ユーザー提供の既存画像を配置

scripts/
└── seed-r2.ts  # 任意: seed 自動化
```

---

## 画面設計 (Screen Design)

### 画面一覧 (Screen List)

| No  | 画面名                          | URLパス | 機能概要                       | 備考     |
| --- | ------------------------------- | ------- | ------------------------------ | -------- |
| 001 | OGP 画像生成 API エンドポイント | `/ogp`  | slug/title から OGP PNG を返却 | API 専用 |

### ワイヤーフレーム・モックアップ (Wireframes & Mockups)

- API 専用のため該当なし

---

## デザインシステム (Design System)

### デザイン方針

- ブランド一貫性のため固定レイアウトを採用し、タイトル可読性を最優先とする

### カラーパレット (Color Palette)

- Primary: `#111827`（背景）
- Secondary: `#3B82F6`（アクセント）
- Text primary: `#FFFFFF`（タイトル）
- Text secondary: `#D1D5DB`（補助テキスト）

---

## 備考・参考資料 (Notes & References)

- `docs/draft.md`
- Cloudflare Workers docs (limits, cache, custom domain)
- Cloudflare Workers docs (R2 binding, local development, `wrangler r2 object put`)
- Hono docs (middleware, query handling)
- Satori docs (font loading, JSX to SVG)
