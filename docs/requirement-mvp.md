# OGP Generator Worker 要件定義書 (MVP)

## 概要 (Overview)

本プロジェクトは、HonoXブログから参照される動的OGP画像をCloudflare Workers上で生成・配信する。

- **サービス名**
  - OGP Generator Worker
- **目的**
  - 記事タイトル等から `1200x630` のPNG OGP画像を動的生成し、SNSクローラー向けに安定配信する
  - ブログアイコンPNGをOGP画像に合成し、ブランドの視認性を担保する
  - 画像生成コストをキャッシュで抑え、無料枠でも運用可能な構成にする
- **ターゲット**
  - ブログ運営者（設定・運用）
  - SNSクローラー（X, Facebook, Slack, Discordなど）

---

## 技術スタック (Technology Stack)

### MVP

| 項目                    | ライブラリ・フレームワーク・パッケージ |
| ----------------------- | -------------------------------------- |
| ランタイム              | Cloudflare Workers                     |
| Webフレームワーク       | Hono (`hono`)                          |
| SVG生成                 | Satori (`satori`)                      |
| レイアウトエンジン      | `yoga-wasm-web`                        |
| SVG→PNG変換             | `svg2png-wasm`                         |
| ストレージ（slug検証）  | Cloudflare R2 Binding                  |
| リンター/フォーマッター | Biome                                  |
| パッケージマネージャー  | pnpm                                   |
| テスト                  | Vitest                                 |

スクリプト:

- `dev`: `wrangler dev`
- `deploy`: `wrangler deploy --minify`
- `cf-typegen`: `wrangler types --env-interface CloudflareBindings`
- `test`: `vitest run`（追加予定）
- `lint`: `biome check .`（追加予定）
- `format`: `biome format --write .`（追加予定）
- `typecheck`: `tsc --noEmit`（追加予定）

### PRODUCT v1以降

- OGPテンプレートの複数バリエーション対応
- KV/R2メタデータ連携によるタイトル自動補完

---

## 機能要件 (Functional Requirements)

### FR-01: OGP画像生成API

- 要件: `GET /ogp` でPNG画像を返す
- 詳細:
  - `slug` を必須パラメータとして受け取り、`title` は任意で受け取る
  - SatoriでSVGを生成後、`svg2png-wasm` でPNGへ変換する
  - `src/assets/ogp-icon.png` を `src/ogp/template.tsx` から直接importし、画像テンプレート内へ配置する
  - 返却ヘッダーは `Content-Type: image/png` を必須とする
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/index.ts`
    - `buildApp(): Hono<{ Bindings: CloudflareBindings }>`
    - `handleOgpRequest(c): Promise<Response>`
  - `src/ogp/render.ts`
    - `renderOgpPng(input: RenderOgpInput): Promise<Uint8Array>`
    - `type RenderOgpInput = { title: string; slug: string }`
  - `src/ogp/template.tsx`
    - `OgpTemplate({ title }): JSX.Element`
    - `type OgpTemplateProps = { title: string }`
  - `src/assets/ogp-icon.png`
    - OGP画像に載せるブログアイコン素材
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常: 必須パラメータが揃っているとPNGが返る
  - 異常: パラメータ不備時に400を返す
  - 異常: アイコンアセット欠損時は生成失敗として扱う

### FR-02: 入力検証とslug存在確認

- 要件: 不正入力・存在しない記事への生成リクエストを拒否する
- 詳細:
  - `slug` は空文字不可、許可文字のみ
  - `title` は最大文字数を制限（例: 100文字）
  - `R2Bucket.head("posts/{slug}.md")` で存在確認し、未存在は404
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/validate.ts`
    - `validateQuery(query: URLSearchParams): ValidationResult`
    - `type ValidationResult = { ok: true; value: ValidQuery } | { ok: false; status: 400; message: string }`
    - `type ValidQuery = { slug: string; title: string }`
  - `src/ogp/validate.ts`
    - `assertPostExists(bucket: R2Bucket, slug: string): Promise<boolean>`
  - `src/utils/types.ts`
    - `type Result<T, E> = Ok<T> | Err<E>`
    - `ok(value)` / `err(error)`
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常: 仕様内入力を受理する
  - 異常: 不正slug・過長title・記事未存在を拒否する

### FR-03: 多層キャッシュ

- 要件: フォント・生成画像のキャッシュで再生成を抑制する
- 詳細:
  - Cache APIでフォントバイナリをキャッシュする
  - Cache APIで生成済みPNGレスポンスをキャッシュする
  - CDNキャッシュ向けに長期キャッシュヘッダーを付与する
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/cache.ts`
    - `getCachedImage(cache: Cache, request: Request): Promise<Response | undefined>`
    - `putCachedImage(cache: Cache, request: Request, response: Response): Promise<void>`
  - `src/ogp/font.ts`
    - `getFontData(cache: Cache, fontName: string): Promise<ArrayBuffer>`
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常: キャッシュヒット時に再生成を行わない
  - 異常: キャッシュミス時は生成処理へフォールバックする

### FR-04: 運用向けエラーハンドリング

- 要件: 失敗要因をHTTPステータスで明確化する
- 詳細:
  - 400: リクエスト不正
  - 404: 対象記事なし
  - 500: 画像生成失敗
- 作成予定のファイル・関数・コンポーネント・型など:
  - `src/ogp/error.ts`
    - `toErrorResponse(error: OgpError): Response`
    - `type OgpError = { type: "bad_request" | "not_found" | "internal"; message: string }`
- テスト: 単体テスト
- テスト観点(正常と異常):
  - 正常: エラー種別ごとに期待ステータスを返す
  - 異常: 想定外エラーでも500で明示的に返す

## 非機能要件 (Non-Functional Requirements)

### NFR-01: パフォーマンス

- キャッシュヒット時は画像再生成を行わない
- レスポンスヘッダーで長期キャッシュを有効化する（`public, max-age=31536000, immutable`）

### NFR-02: 互換性

- SNSクローラーが取得可能な公開URLで配信する
- カスタムドメイン配下で運用し、CDNキャッシュを有効化する

### NFR-03: セキュリティ

- 入力値の検証を必須化する
- Cloudflare WAFレートリミット設定を運用手順に含める

### NFR-04: 可観測性

- 失敗時はログを出力し、`400/404/500` を明確に返す

### NFR-05: ライセンスコンプライアンス

| リソース     | 用途            | ライセンス                | クレジット表記           |
| ------------ | --------------- | ------------------------- | ------------------------ |
| Noto Sans JP | OGP画像フォント | SIL Open Font License 1.1 | 必要に応じてREADMEへ追記 |
| satori       | SVG生成         | MPL-2.0                   | 不要（LICENSE同梱）      |
| svg2png-wasm | PNG変換         | MIT（要確認）             | 不要（LICENSE同梱）      |

---

## ディレクトリ構成と作成ファイル (Directory Structure & Files)

```
src/
├── index.ts
├── assets/
│   └── ogp-icon.png
└── ogp/
    ├── render.ts
    ├── render.test.ts
    ├── template.tsx
    ├── validate.ts
    ├── validate.test.ts
    ├── post-exists.ts
    ├── cache.ts
    ├── font.ts
    └── error.ts
src/utils/
└── types.ts
```

- `worker-configuration.d.ts` は `wrangler types` により生成・更新する

---

## 画面設計 (Screen Design)

APIプロジェクトのためUI画面はなし。外部公開エンドポイントのみ定義する。

| No  | エンドポイント | メソッド | 機能概要                 |
| --- | -------------- | -------- | ------------------------ |
| 001 | `/ogp`         | GET      | OGP画像(PNG)を生成・返却 |

---

## 備考・参考資料 (Notes & References)

- Cloudflare Workers Runtime APIs - Cache: https://developers.cloudflare.com/workers/runtime-apis/cache/
- Cloudflare Workers Platform Limits: https://developers.cloudflare.com/workers/platform/limits/
- Satori README: https://github.com/vercel/satori/blob/main/README.md
